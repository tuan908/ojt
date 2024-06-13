package com.tuanna.ojt.api.constant;

import java.io.Serializable;

public class Constant implements Serializable {
	private static final long serialVersionUID = -5939961552007067863L;
	
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
}
