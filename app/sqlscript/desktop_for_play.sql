-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.5.36 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  8.2.0.4675
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出 desktop 的数据库结构
CREATE DATABASE IF NOT EXISTS `desktop` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `desktop`;


-- 导出  表 desktop.tb_app 结构
CREATE TABLE IF NOT EXISTS `tb_app` (
  `ID` varchar(32) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `REMARK` varchar(500) DEFAULT NULL,
  `ORDERNO` int(11) NOT NULL,
  `ISSHOW` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  desktop.tb_app 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `tb_app` DISABLE KEYS */;
INSERT IGNORE INTO `tb_app` (`ID`, `NAME`, `REMARK`, `ORDERNO`, `ISSHOW`) VALUES
	('1', '系统管理', '																				管理系统应用\r\n                    \r\n                    \r\n                    \r\n                    ', 1, 1),
	('4028818346130dd10146130e61b30001', '测试', '																																			                    \r\n                    \r\n                    \r\n                    \r\n                    \r\n                    \r\n                    \r\n                    ', 0, 1);
/*!40000 ALTER TABLE `tb_app` ENABLE KEYS */;


-- 导出  表 desktop.tb_appmodule 结构
CREATE TABLE IF NOT EXISTS `tb_appmodule` (
  `ID` varchar(32) NOT NULL,
  `APPID` varchar(32) NOT NULL,
  `MODULEID` varchar(32) DEFAULT NULL,
  `ORDERNO` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `APPID` (`APPID`),
  KEY `MODULEID` (`MODULEID`),
  CONSTRAINT `tb_appmodule_ibfk_1` FOREIGN KEY (`APPID`) REFERENCES `tb_app` (`ID`),
  CONSTRAINT `tb_appmodule_ibfk_2` FOREIGN KEY (`MODULEID`) REFERENCES `tb_module` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  desktop.tb_appmodule 的数据：~4 rows (大约)
/*!40000 ALTER TABLE `tb_appmodule` DISABLE KEYS */;
INSERT IGNORE INTO `tb_appmodule` (`ID`, `APPID`, `MODULEID`, `ORDERNO`) VALUES
	('1', '1', '1', 1),
	('402881834744934e0147449f853d0005', '4028818346130dd10146130e61b30001', '40288183470f2a0801470f43fe970000', 2147483647),
	('402881834744934e0147449f85430006', '4028818346130dd10146130e61b30001', '402881834710f4f1014710f567270000', 2147483647),
	('402881834744934e0147449f854a0007', '4028818346130dd10146130e61b30001', '40288183471102040147110263470000', 2147483647);
/*!40000 ALTER TABLE `tb_appmodule` ENABLE KEYS */;


-- 导出  表 desktop.tb_module 结构
CREATE TABLE IF NOT EXISTS `tb_module` (
  `ID` varchar(32) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `CODE` varchar(50) DEFAULT NULL,
  `ICON` varchar(100) NOT NULL,
  `REMARK` varchar(500) DEFAULT NULL,
  `URL` varchar(100) DEFAULT NULL,
  `WIDTH` int(11) DEFAULT '0',
  `HEIGHT` int(11) DEFAULT NULL,
  `MAXWIDTH` int(11) DEFAULT '0',
  `MAXHEIGHT` int(11) DEFAULT NULL,
  `MINWIDTH` int(11) DEFAULT '0',
  `MINHEIGHT` int(11) DEFAULT NULL,
  `DRAGGABLE` int(11) NOT NULL DEFAULT '1',
  `RESIZEABLE` int(11) NOT NULL DEFAULT '1',
  `MINIMIZE` int(11) NOT NULL DEFAULT '1',
  `MAXIMIZE` int(11) NOT NULL DEFAULT '1',
  `ALIGN` varchar(20) DEFAULT NULL,
  `VALIGN` varchar(20) DEFAULT NULL,
  `VISIABLE` int(11) DEFAULT '1',
  `USERIDS` varchar(800) DEFAULT NULL,
  `USERNAMES` varchar(200) DEFAULT NULL,
  `ISSHOW` int(11) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  desktop.tb_module 的数据：~6 rows (大约)
/*!40000 ALTER TABLE `tb_module` DISABLE KEYS */;
INSERT IGNORE INTO `tb_module` (`ID`, `NAME`, `CODE`, `ICON`, `REMARK`, `URL`, `WIDTH`, `HEIGHT`, `MAXWIDTH`, `MAXHEIGHT`, `MINWIDTH`, `MINHEIGHT`, `DRAGGABLE`, `RESIZEABLE`, `MINIMIZE`, `MAXIMIZE`, `ALIGN`, `VALIGN`, `VISIABLE`, `USERIDS`, `USERNAMES`, `ISSHOW`) VALUES
	('1', '桌面管理', 'ZMGL', 'icon_029.png', '					测试一个remark的bug\r\n\r\n\r\n\r\n\r\n                    ', 'management/index', 800, 600, 0, 0, 0, 0, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1),
	('40288183470f2a0801470f43fe970000', '百度', 'BD', '547723.png', '                    ', 'http://www.baidu.com', 800, 600, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1),
	('402881834710e98f014710eeb07e0000', '测试模块2', 'CSMK2', 'icon_004.png', '                    ', 'http://www.baidu.com', 800, 600, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1),
	('402881834710f01c014710f07f410000', '测试模块3', 'CSMK3', 'icon_010.png', '                    ', 'http://www.baidu.com', 800, 600, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1),
	('402881834710f4f1014710f567270000', '测试模块4', 'CSMK4', 'icon_009.png', '                    ', 'http://www.baidu.com', 800, 600, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1),
	('40288183471102040147110263470000', '测试模块5', 'CSMK5', 'icon_009.png', '                    ', 'http://www.baidu.com', 800, 600, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 'center', 'baseline', 1, NULL, NULL, 1);
/*!40000 ALTER TABLE `tb_module` ENABLE KEYS */;


-- 导出  表 desktop.tb_theme 结构
CREATE TABLE IF NOT EXISTS `tb_theme` (
  `ID` varchar(32) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `STYLE` varchar(100) DEFAULT NULL,
  `REMARK` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  desktop.tb_theme 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `tb_theme` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_theme` ENABLE KEYS */;


-- 导出  表 desktop.tb_userdesktop 结构
CREATE TABLE IF NOT EXISTS `tb_userdesktop` (
  `ID` varchar(32) NOT NULL,
  `DESKTOPJSONDATA` longtext,
  `THEMEID` varchar(32) NOT NULL,
  `USERID` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  desktop.tb_userdesktop 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `tb_userdesktop` DISABLE KEYS */;
INSERT IGNORE INTO `tb_userdesktop` (`ID`, `DESKTOPJSONDATA`, `THEMEID`, `USERID`) VALUES
	('402881834757ccdb014757d18e410002', '{"pages":[{"pageno":"1","modules":[{"id":"1","draggable":0,"resizeable":0,"minimize":0,"maximize":0}]}]}', '17', '-1');
/*!40000 ALTER TABLE `tb_userdesktop` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
