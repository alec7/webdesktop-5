package controllers.management;

import java.io.File;
import java.util.List;

import models.ModuleBean;
import play.Play;
import play.libs.Files;
import play.mvc.Controller;
import utils.cache.DesktopCache;

/**
 * 创建人：xy
 * 创建时间：14-3-15
 *
 * @version 1.0
 */

public class ModuleManager extends Controller {
	public static void findModules() {
		List<ModuleBean> modules = DesktopCache.getAllModules();
		render(modules);
	}

	public static void show(String id) {
		ModuleBean module = DesktopCache.getModule(id);
		render(module);
	}

	public static void input() {
		render();
	}

	public static void create(ModuleBean module, File icon) {
		saveOrUpdate(module, icon);

		DesktopCache.initModules();
		DesktopCache.initApps();

		findModules();
	}

	public static void edit(ModuleBean module, File icon) {
		saveOrUpdate(module, icon);

		DesktopCache.initModules();
		DesktopCache.initApps();

		findModules();
	}

	private static final void saveOrUpdate(ModuleBean module, File icon) {
		if (icon != null) {
			File iconDir = new File(Play.configuration.getProperty("icon.path"));
			if (!iconDir.exists()) {
				iconDir.mkdir();
			}
			File newIcon = new File(iconDir + File.separator + icon.getName());
			Files.copy(icon, newIcon);
			module.icon = newIcon.getName();
		}
		module.save();
	}
}
