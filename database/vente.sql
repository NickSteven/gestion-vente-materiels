-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 24 mars 2021 à 13:54
-- Version du serveur :  10.4.17-MariaDB
-- Version de PHP : 7.3.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `vente`
--

-- --------------------------------------------------------

--
-- Structure de la table `achat`
--

CREATE TABLE `achat` (
  `numFacture` int(10) NOT NULL,
  `numClient` int(10) NOT NULL,
  `numMat` int(10) NOT NULL,
  `quantite` int(10) NOT NULL,
  `date_cm` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `achat`
--

INSERT INTO `achat` (`numFacture`, `numClient`, `numMat`, `quantite`, `date_cm`) VALUES
(66, 28, 83, 9, '2021-03-22'),
(67, 25, 82, 5, '2021-03-23');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `numClient` int(10) NOT NULL,
  `nomClient` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`numClient`, `nomClient`) VALUES
(25, 'Vola'),
(28, 'Fidèle');

-- --------------------------------------------------------

--
-- Structure de la table `materiel`
--

CREATE TABLE `materiel` (
  `numMat` int(11) NOT NULL,
  `design` varchar(200) DEFAULT NULL,
  `prixUnit` int(11) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `materiel`
--

INSERT INTO `materiel` (`numMat`, `design`, `prixUnit`, `stock`) VALUES
(82, 'Souris', 1000, 5),
(83, 'Ordinateur', 5000000, 11),
(84, 'Clavier', 30000, 17);

-- --------------------------------------------------------

--
-- Structure de la table `mvt_ent`
--

CREATE TABLE `mvt_ent` (
  `cle_ent` int(10) NOT NULL,
  `design` varchar(200) NOT NULL,
  `date_ent` date NOT NULL DEFAULT current_timestamp(),
  `quantite_ent` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `mvt_ent`
--

INSERT INTO `mvt_ent` (`cle_ent`, `design`, `date_ent`, `quantite_ent`) VALUES
(15, 'Souris', '2021-02-17', 10),
(16, 'Ordinateur', '2021-03-22', 20),
(17, 'Clavier', '2021-03-22', 17);

-- --------------------------------------------------------

--
-- Structure de la table `mvt_sort`
--

CREATE TABLE `mvt_sort` (
  `cle_sort` int(10) NOT NULL,
  `cle_design` int(10) NOT NULL,
  `date_sort` date NOT NULL,
  `quantite_sort` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `mvt_sort`
--

INSERT INTO `mvt_sort` (`cle_sort`, `cle_design`, `date_sort`, `quantite_sort`) VALUES
(14, 82, '2021-02-17', 2),
(15, 82, '2021-02-18', 1),
(16, 82, '2021-02-17', 1),
(17, 83, '2021-03-22', 10),
(18, 82, '2021-03-23', 5);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `achat`
--
ALTER TABLE `achat`
  ADD PRIMARY KEY (`numFacture`),
  ADD KEY `numClient` (`numClient`),
  ADD KEY `numMat` (`numMat`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`numClient`);

--
-- Index pour la table `materiel`
--
ALTER TABLE `materiel`
  ADD PRIMARY KEY (`numMat`);

--
-- Index pour la table `mvt_ent`
--
ALTER TABLE `mvt_ent`
  ADD PRIMARY KEY (`cle_ent`);

--
-- Index pour la table `mvt_sort`
--
ALTER TABLE `mvt_sort`
  ADD PRIMARY KEY (`cle_sort`),
  ADD KEY `cle_design` (`cle_design`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `achat`
--
ALTER TABLE `achat`
  MODIFY `numFacture` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `numClient` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `materiel`
--
ALTER TABLE `materiel`
  MODIFY `numMat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT pour la table `mvt_ent`
--
ALTER TABLE `mvt_ent`
  MODIFY `cle_ent` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `mvt_sort`
--
ALTER TABLE `mvt_sort`
  MODIFY `cle_sort` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achat`
--
ALTER TABLE `achat`
  ADD CONSTRAINT `achat_ibfk_1` FOREIGN KEY (`numClient`) REFERENCES `client` (`numClient`),
  ADD CONSTRAINT `achat_ibfk_2` FOREIGN KEY (`numMat`) REFERENCES `materiel` (`numMat`);

--
-- Contraintes pour la table `mvt_sort`
--
ALTER TABLE `mvt_sort`
  ADD CONSTRAINT `mvt_sort_ibfk_1` FOREIGN KEY (`cle_design`) REFERENCES `materiel` (`numMat`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
