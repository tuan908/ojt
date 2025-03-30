package com.tuanna.api.constant;

public class Constant {
  /** Page size for paged student list */
  public static final int PAGE_SIZE = 10;

  /** Sort column for paged student list */
  public static final String SORT_COLUMN = "code";

  /** Current API version */
  public static final String API_VERSION = "v1";

  /** Current API base path */
  public static final String API_BASE_PATH = "/api/" + API_VERSION;

  /** Salt length */
  public static final int ARGON2_SALT_LENGTH = 19;

  /** Hash length */
  public static final int ARGON2_HASH_LENGTH = 20;

  /** Parallelism */
  public static final int ARGON2_PARALLELISM = 2;

  /** Memory used */
  public static final int ARGON2_MEMORY = 1 << 14;

  /** Iterations */
  public static final int ARGON2_ITERATIONS = 2;

  /** yyyy-MM-dd HH:mm:ss.SSS */
  public static final String DATETIME_FORMAT_DASH = "yyyy-MM-dd HH:mm:ss.SSS";

  public static final String CODE_OK = "ok";
}
