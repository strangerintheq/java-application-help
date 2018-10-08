package ru.spb.nicetu.jah;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public abstract class BasicHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange http) throws IOException {
        OutputStream outputStream = http.getResponseBody();
        InputStream requestBody = http.getRequestBody();
        String path = http.getRequestURI().getRawPath();
        HandleResult result = appendHeaders(http, process(path));
        http.sendResponseHeaders(result.getCode(), result.getData().length);
        outputStream.write(result.getData());
        outputStream.close();
    }

    private HandleResult appendHeaders(HttpExchange http, HandleResult result) {
        if (result.getHeaders() != null) {
            for (String header: result.getHeaders().keySet()) {
                http.getResponseHeaders().add(header, result.getHeaders().get(header));
            }
        }
        return result;
    }

    private HandleResult process(String path) {
        try {
            return createResponse(path);
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return new HandleResult(sw.getBuffer().toString().getBytes()).code(500);
        }
    }

    protected abstract HandleResult createResponse(String request);
}
