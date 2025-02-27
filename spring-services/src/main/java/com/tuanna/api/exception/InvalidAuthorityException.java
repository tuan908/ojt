package com.tuanna.api.exception;

import java.io.Serial;

public class InvalidAuthorityException extends Exception {

    @Serial
    private static final long serialVersionUID = 887793050195733626L;

	public InvalidAuthorityException(String message) {
		super(message);
	}
}
