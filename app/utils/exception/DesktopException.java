package utils.exception;

/**
 * 创建人：xy
 * 创建时间：14-2-15
 *
 * @version 1.0
 */

public class DesktopException extends RuntimeException {
	public DesktopException() {
	}

	public DesktopException(String message) {
		super(message);
	}

	public DesktopException(String message, Throwable cause) {
		super(message, cause);
	}

	public DesktopException(Throwable cause) {
		super(cause);
	}
}
