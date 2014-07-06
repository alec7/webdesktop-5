import java.util.List;

import models.AppBean;
import models.ModuleBean;
import models.UserdesktopBean;
import org.junit.Test;
import play.cache.Cache;
import play.test.UnitTest;
import utils.cache.DesktopCache;

/**
 * 创建人：xy
 * 创建时间：2014/5/25
 *
 * @version 1.0
 */

public class DesktopCacheTests extends UnitTest {

	@Test
	public void testInitUserdesktops() {
		Object o = Cache.get("uds");
		assertNotNull(o);

	}

	@Test
	public void testGetUserdesktop() {
		Object o = Cache.get("uds");
		List<UserdesktopBean> desktop = (List<UserdesktopBean>) o;
		//just test your value if you have another
		assertNotNull(DesktopCache.getUserdesktop("-1"));
		assertEquals("4028818446088165014608818bb50000", DesktopCache.getUserdesktop("-1").id);
	}

	@Test
	public void testInitModules() {
		Object o = Cache.get("modules");
		assertNotNull(o);
	}

	@Test
	public void testGetAllModules() {
		List<ModuleBean> moduleBeans = (List<ModuleBean>) Cache.get("modules");
		assertEquals(moduleBeans.size(), DesktopCache.getAllModules().size());
	}

	@Test
	public void testGetModule() {
		assertNotNull(DesktopCache.getModule("1"));
		assertEquals("ZMGL", DesktopCache.getModule("1").code);
	}

	@Test
	public void testInitApps() {
		Object o = Cache.get("apps");
		assertNotNull(o);
	}

	@Test
	public void testGetAllApps() {
		List<AppBean> apps = (List<AppBean>) Cache.get("apps");
		assertEquals(apps.size(), DesktopCache.getAllApps().size());
	}

	@Test
	public void testGetApp() {
		assertNotNull(DesktopCache.getApp("1"));
		assertEquals("系统管理", DesktopCache.getApp("1").name);
	}
}
