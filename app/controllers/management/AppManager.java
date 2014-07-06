package controllers.management;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import models.AppBean;
import models.AppModuleBean;
import models.ModuleBean;
import org.apache.commons.lang.StringUtils;
import play.mvc.Controller;
import utils.cache.DesktopCache;

/**
 * 维护桌面应用的管理类
 * 创建人：xy
 * 创建时间：14-3-15
 *
 * @version 1.0
 */

public class AppManager extends Controller {

	public static void findApps() {
		List<AppBean> apps = DesktopCache.getAllApps();
		render(apps);
	}

	public static void show(String id) {
		AppBean app = DesktopCache.getApp(id);

		List<ModuleBean> modules = DesktopCache.getAllModules();

		List<ModuleBean> otherModule = new ArrayList<ModuleBean>(modules);

		//将此应用下的模块过滤掉,以便于页面上选择模块时不会重复选择
		Iterator<ModuleBean> _appModule = app.modules.iterator();

		while (_appModule.hasNext()) {
			ModuleBean m1 = _appModule.next();
			Iterator<ModuleBean> it = otherModule.iterator();
			while (it.hasNext()) {
				ModuleBean m2 = it.next();
				if (m2.isShow == 0) {
					it.remove();
				}
				if (m1.id.equals(m2.id)) {
					it.remove();
				}
			}
		}

		render(app, otherModule);
	}

	public static void edit(AppBean app, String ids) {

		app.merge();

		DesktopCache.initApps();
		//先删除appModule，在根据ids重建appModule
		AppModuleBean.delete("appId = ?", app.id);
		if (StringUtils.isNotBlank(ids)) {
			String[] id = ids.split(",");
			for (int i = 0; i < id.length; i++) {
				ModuleBean module = DesktopCache.getModule(id[i]);
				AppModuleBean am = new AppModuleBean();
				am.appId = app.id;
				am.moduleId = module.id;
				am.save();
			}
		}

		//重建appmoudle关系，再刷一次缓存
		DesktopCache.initApps();
		findApps();
	}

	public static void input() {
		List<ModuleBean> _allModule = DesktopCache.getAllModules();
		render(_allModule);
	}

	public static void create(AppBean app, String ids) {

		app.save();

		//刷一次缓存
		DesktopCache.initApps();

		//保存appmodule
		if (StringUtils.isNotBlank(ids)) {
			String[] id = ids.split(",");
			for (int i = 0; i < id.length; i++) {
				ModuleBean module = DesktopCache.getModule(id[i]);
				AppModuleBean am = new AppModuleBean();
				am.appId = app.id;
				am.moduleId = module.id;
				am.save();
			}
		}

		//重建appmoudle关系，再刷一次缓存
		DesktopCache.initApps();

		findApps();
	}

}
