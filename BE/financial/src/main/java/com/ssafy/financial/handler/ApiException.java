package com.ssafy.financial.handler;

import com.ssafy.financial.util.ErrorCode;

public class ApiException extends RuntimeException {
    private final ErrorCode errorCode;

    public ApiException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public String getCode() {
        return errorCode.name();
    }

    public String getMessage() {
        return errorCode.getMessage();
    }
}