package ru.spb.nicetu.jah;

import java.util.HashMap;
import java.util.Map;

public class HandleResult {

    private int code;
    private byte[] data;
    private Map<String, String> headers;

    public HandleResult(byte[] data) {
        this.code = 200;
        this.data = data;
    }

    public HandleResult code(int responseCode) {
        this.code = responseCode;
        return this;
    }

    public HandleResult header(String name, String value) {
        if (null == headers) {
            headers = new HashMap<>();
        }
        headers.put(name, value);
        return this;
    }

    public void contentType(String type) {
        header("Content-Type", type);
    }

    public int getCode() {
        return code;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public byte[] getData() {
        return data;
    }

}
