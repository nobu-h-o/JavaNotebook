package com.example.demo;

public class CodeRequest {
    private String code;
    private String language;
    private String input;

    // Default constructor
    public CodeRequest() {}

    // Getters and setters
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }

    public String getInput() {
        return input;
    }
    public void setInput(String input) {
        this.input = input;
    }
}