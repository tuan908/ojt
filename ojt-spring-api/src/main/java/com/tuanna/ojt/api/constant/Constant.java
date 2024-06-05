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

}
