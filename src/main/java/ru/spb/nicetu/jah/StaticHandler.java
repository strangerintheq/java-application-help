package ru.spb.nicetu.jah;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class StaticHandler extends BasicHandler {

    private String routePath;

    private final String fsPath;

    private Map<String, String> headers = new HashMap<String, String>(){{
        put("html", "text/html");
        put("css", "text/css");
        put("js", "text/javascript");
        put("json", "application/json");
        put("svg", "image/svg+xml");
    }};

    public StaticHandler(String path, String filesystemPath) throws FileNotFoundException {
        routePath = path;
        fsPath = getStaticDirectory(filesystemPath);
        File rootFolder = new File(fsPath);
        if (!rootFolder.exists() || !rootFolder.isDirectory()) {
            throw new FileNotFoundException(filesystemPath);
        }
    }

    @Override
    protected HandleResult createResponse(String request) {
//        System.out.println("request = " + request);
        try {
            String path = fsPath.substring(1) + request.substring(routePath.length());
            HandleResult result = new HandleResult(FileReader.read(new FileInputStream(path)).toByteArray());
            String ext = request.substring(request.lastIndexOf(".") + 1);
            if (headers.containsKey(ext)) {
                result.contentType(headers.get(ext));
            }
            return result;
        } catch (IOException e) {
            return new HandleResult((404 + " " + request).getBytes()).code(404);
        }
    }

    private static String getStaticDirectory(String staticDirectory) throws FileNotFoundException {
        URL resource = StaticHandler.class.getClassLoader().getResource(staticDirectory);
        if (null == resource) {
            throw new FileNotFoundException(staticDirectory);
        }
        return resource.getPath();
    }
}
