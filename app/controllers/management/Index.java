package controllers.management;

import play.Play;
import play.mvc.Controller;

/**
 * 创建人：xy
 * 创建时间：14-3-15
 *
 * @version 1.0
 */

public class Index extends Controller {
	public static void index() {
		String ctx = Play.ctxPath;
		render(ctx);
	}
}
