package com.tuanna.api.constant;

public enum MessageKey {
  ERROR_UNAUTHORIZED("error.unauthorized"),
  ERROR_FORBIDDEN("error.forbidden"),
  ERROR_NOT_FOUND("error.notFound"),
  ERROR_INTERNAL_SERVER_ERROR("error.internalServerError"),
  ERROR_INVALID_CREDENTIALS("error.invalidCredentials"),
  ERROR_VALIDATION_FAILED("error.validationFailed"),
  ERROR_RESOURCE_ALREADY_EXISTS("error.resourceAlreadyExists"),
  ERROR_BAD_REQUEST("error.badRequest"),
  ERROR_TOKEN_EXPIRED("error.tokenExpired"),
  ERROR_SESSION_TIMEOUT("error.sessionTimeout"),
  ERROR_DATABASE_ERROR("error.databaseError"),
  ERROR_DEPENDENCY_FAILED("error.dependencyFailed"),
  ERROR_UNSUPPORTED_MEDIATYPE("error.unsupportedMediaType");

  private final String key;

  MessageKey(String key) {
    this.key = key;
  }

  public String key() {
    return key;
  }

}
