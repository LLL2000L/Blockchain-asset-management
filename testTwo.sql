-- phpMyAdmin SQL Dump
-- version 4.0.10.20
-- https://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2022-05-26 15:01:22
-- 服务器版本: 5.6.50-log
-- PHP 版本: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `testTwo`
--

-- --------------------------------------------------------

--
-- 表的结构 `adminMaster`
--

CREATE TABLE IF NOT EXISTS `adminMaster` (
  `name` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `user_type` varchar(32) NOT NULL,
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- 表的结构 `registerPool`
--

CREATE TABLE IF NOT EXISTS `registerPool` (
  `name` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `user_type` varchar(32) NOT NULL,
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `traceData`
--

CREATE TABLE IF NOT EXISTS `traceData` (
  `txType` varchar(32) NOT NULL,
  `txHash` varchar(100) NOT NULL,
  `uintID` int(10) NOT NULL,
  `assetsName` varchar(32) NOT NULL,
  `userName` varchar(32) NOT NULL,
  `person` varchar(32) NOT NULL,
  `timeStamp` varchar(32) NOT NULL,
  PRIMARY KEY (`txHash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `name` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `user_type` varchar(32) NOT NULL,
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
