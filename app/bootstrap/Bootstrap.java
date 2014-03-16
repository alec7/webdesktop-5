package bootstrap;

import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import utils.cache.DesktopCache;

/**
 * 创建人：xy
 * 创建时间：14-2-23
 *
 * @version 1.0
 */

@OnApplicationStart
public class Bootstrap extends Job {
	@Override
	public void doJob() throws Exception {
		//modules依赖apps,所以先init modules
		DesktopCache.initModules();
		DesktopCache.initApps();

		DesktopCache.initThemes();
		DesktopCache.initIcons();
		DesktopCache.initUserdesktops();

		Logger.info("----------------------------缓存构建完成--------------------------------");
	}
}
