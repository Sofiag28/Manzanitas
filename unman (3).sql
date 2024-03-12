-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-03-2024 a las 16:24:39
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

use unman;

/*sentencias de tablas */

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `unman`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas`
--

CREATE TABLE `manzanas` (
  `id_M` int(11) NOT NULL,
  `Nombre` varchar(25) NOT NULL,
  `Direccion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzanas`
--

INSERT INTO `manzanas` (`id_M`, `Nombre`, `Direccion`) VALUES
(1, 'Puente Aranda', 'Av. Cali 10-14'),
(2, 'Engativa', 'Calle 100 #10-14'),
(3, 'Ciudad Bolivar', 'Calle 76 #24-14'),
(4, 'Usaquen', 'Calle 40sur no.35-6'),
(5, 'Fontibon', 'calle sexta 23-77'),
(6, 'Antonio Nariño', 'Kr 1 no.44-13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `m_s`
--

CREATE TABLE `m_s` (
  `id_M1` int(11) NOT NULL,
  `id_S1` int(11) NOT NULL,
  `Fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `m_s`
--

INSERT INTO `m_s` (`id_M1`, `id_S1`, `Fecha`) VALUES
(1, 7, '0000-00-00 00:00:00'),
(1, 8, '0000-00-00 00:00:00'),
(1, 9, '0000-00-00 00:00:00'),
(2, 10, '0000-00-00 00:00:00'),
(2, 11, '0000-00-00 00:00:00'),
(2, 12, '0000-00-00 00:00:00'),
(2, 13, '0000-00-00 00:00:00'),
(2, 14, '0000-00-00 00:00:00'),
(3, 7, '0000-00-00 00:00:00'),
(3, 9, '0000-00-00 00:00:00'),
(4, 7, '0000-00-00 00:00:00'),
(4, 8, '0000-00-00 00:00:00'),
(4, 9, '0000-00-00 00:00:00'),
(4, 10, '0000-00-00 00:00:00'),
(5, 11, '0000-00-00 00:00:00'),
(5, 12, '0000-00-00 00:00:00'),
(5, 13, '0000-00-00 00:00:00'),
(5, 14, '0000-00-00 00:00:00'),
(6, 7, '0000-00-00 00:00:00'),
(6, 8, '0000-00-00 00:00:00'),
(6, 9, '0000-00-00 00:00:00'),
(6, 10, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_S` int(20) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_S`, `Nombre`, `Tipo`) VALUES
(7, 'Clases de Baile', 'Entretenimiento'),
(8, 'Cine', 'Entretenimiento'),
(9, 'Piscina', 'Deporte'),
(10, 'Gimnasio', 'Deporte'),
(11, 'Yoga', 'Deporte'),
(12, 'Cocina', 'Gastronomia'),
(13, 'Coser', 'Maquina'),
(14, 'Clases de Baile', 'Entretenimiento');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitudes` int(11) NOT NULL,
  `Fecha` datetime DEFAULT NULL,
  `id1` int(11) DEFAULT NULL,
  `CodigoS` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id_solicitudes`, `Fecha`, `id1`, `CodigoS`) VALUES
(1, '2024-02-16 01:03:00', 1, 6),
(2, '2024-02-14 14:02:00', 18, 6),
(3, '2024-02-06 14:02:00', 19, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuarios` int(11) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Tipo` varchar(50) NOT NULL,
  `Documento` varchar(10) NOT NULL,
  `Contraseña` varchar(20) NOT NULL,
  `Rol` set('usuario','Administrador') DEFAULT 'usuario',
  `id_M1` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idusuarios`, `Nombre`, `Tipo`, `Documento`, `Contraseña`, `Rol`, `id_M1`) VALUES
(1, 'Sofi', 'CC', '123', '123456', 'Administrador', 3),
(18, 'Lau', 'CC', '1235', '1234', 'Administrador', 4),
(19, 'ala', 'TI', '12', '12', 'usuario', 1),
(20, 'sandra', 'TI', '2345', '456', 'usuario', 1),
(21, 'mono', 'TI', '456', '123', 'usuario', 1),
(22, 'maria', 'TI', '10', '10', 'usuario', 4),
(23, 'angel', 'TI', '2367', '2367', 'usuario', 6),
(24, 'paul', 'TI', '78', '78', 'usuario', 2),
(25, 'luz', 'TI', '23', '23', 'usuario', 4),
(26, 'ivan', 'CC', '908', '908', 'usuario', 1),
(27, 'lp', 'TI', '89', '89', 'usuario', 1),
(38, 'yo', 'TI', '865', '865', 'usuario', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  ADD PRIMARY KEY (`id_M`);

--
-- Indices de la tabla `m_s`
--
ALTER TABLE `m_s`
  ADD KEY `fk_id2` (`id_S1`),
  ADD KEY `fk_id4` (`id_M1`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_S`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD KEY `fk_idsoli` (`id1`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idusuarios`),
  ADD UNIQUE KEY `Documento` (`Documento`),
  ADD KEY `fk_id1` (`id_M1`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  MODIFY `id_M` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_S` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idusuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `m_s`
--
ALTER TABLE `m_s`
  ADD CONSTRAINT `fk_id2` FOREIGN KEY (`id_S1`) REFERENCES `servicios` (`id_S`),
  ADD CONSTRAINT `fk_id4` FOREIGN KEY (`id_M1`) REFERENCES `manzanas` (`id_M`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fk_id3` FOREIGN KEY (`id1`) REFERENCES `usuarios` (`idusuarios`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_id1` FOREIGN KEY (`id_M1`) REFERENCES `manzanas` (`id_M`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
