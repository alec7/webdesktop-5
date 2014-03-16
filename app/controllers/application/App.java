package controllers.application;

import java.util.List;

import models.AppBean;
import play.Play;
import play.mvc.Controller;
import utils.cache.DesktopCache;

/**
 * 创建人：xy
 * 创建时间：14-3-15
 *
 * @version 1.0
 */

public class App extends Controller {
	public static void Query() {
		List<AppBean> apps = DesktopCache.getAllApps();
		String ctx = Play.ctxPath;
		render(apps, ctx);
	}
}
