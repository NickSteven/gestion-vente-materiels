// Imporatation des modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const glob = require('glob');
//const moment = require('moment');
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

const app = express();

// Creation de connexion
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'vente',
	multipleStatements: true
});

// Connexion à la base de donnée
conn.connect((err) =>{
	if(err) throw err;
	console.log('Mysql Connected....');
});

/*Configuration pour que les autres 
dossiers contenant les autres pages sous le dossier parent (ici le view)
soient reconnu par la node*/
let viewPaths = glob.sync('views/**/').map(path => {
    return path.substring(0, path.length - 1)
})
// Configuration du dossier parent pour contenir les fichiers de vue
app.set('views', viewPaths);

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Regler le dossier public comme dossier statique pour les fichiers statiques
app.use('/assets', express.static(__dirname + '/public'));









//********* BACKEND MATERIEL *************


// Route pour la page d'accueil (et liste de matériel)
app.get('/',(req, res) => {
	let sql = "SELECT * FROM materiel";
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		
		res.render('home_page', {
			results: results
		});
	});
}); 





// Insertion nouveau matériel
app.post('/save', (req, res) => {
	let data = {
		design: req.body.product_name,
		prixUnit: req.body.product_price,
		stock: req.body.product_stock
	};
	let queries = ["INSERT INTO materiel SET ?",
				  "INSERT INTO mvt_ent (design, quantite_ent) VALUES ('"+req.body.product_name+"', '"+req.body.product_stock+"')"];
	let query = conn.query(queries.join(';'), data,(err,results) =>{
		if(err) throw err;
		res.redirect('/');
	});
});

// Mise à jour matériel
app.post('/update', (req, res) => {
	let sql  = "UPDATE materiel SET design='"+req.body.product_name+"', prixUnit='"+req.body.product_price+"' , stock='"+req.body.product_stock+"' WHERE numMat="+req.body.id;
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	});
});

// Suppression matériel
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM materiel WHERE design = '"+req.body.product_id+"'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    
      res.redirect('/');
  });
});


//Liste des matériels avec la somme total des ventes
app.post('/rechMat', (req, res) =>{
	let queries = ["SELECT * from materiel",
				"SELECT design, sum(quantite*prixUnit) as somm_total from materiel, achat where materiel.numMat = achat.numMat and year(date_cm) = '"+req.body.date_prod+"' and materiel.numMat = "+req.body.nom_mat];
	let query = conn.query(queries.join(';'), (err, results) => {
		if(err) throw err;
		res.render('home_page', {
			results : results[0],
			rech_vente : results[1]
		});
		
	});
});


//************ FIN BACKEND MATERIEL ************************






//************* BACKEND CLIENT ******************************

// Route pour la liste des clients et affichage page client
app.get('/clients', (req, res) => {
	let sql = "SELECT * FROM client";
	let query = conn.query(sql, (err, result) => {
		if(err) throw err;
		res.render('client', {
			result: result
		});
	});
});


// Ajout nouveau client
app.post('/add', (req, res) => {
	let data = {
		nomClient: req.body.nom_client
	};
	let sql = "INSERT INTO client SET ?";
	let query = conn.query(sql, data,(err,results) =>{
		if(err) throw err;
		res.redirect('/clients');
	});
});

// Modifier un client
app.post('/updt', (req, res) => {
	let sql  = "UPDATE client SET nomClient='"+req.body.nom_client+"' WHERE numClient="+req.body.id;
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.redirect('/clients');
	});
});

// Supprimer un client
app.post('/dlt', (req, res) => {
  let sql = "DELETE FROM client WHERE numClient= " +req.body.num_client+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/clients');
  });
});


//Chiffre d'affaire par client dans une année
app.post('/rechCli', (req, res) => {
	let queries = ["SELECT * from client",
					"SELECT nomClient, sum(quantite*prixUnit) as chiffre FROM client, materiel, achat WHERE client.numClient=achat.numClient and materiel.numMat = achat.numMat and achat.numClient = '"+req.body.nom_cli+"' and year(date_cm) = "+req.body.date_rech];
	let query = conn.query(queries.join(';'), (err, results) =>{
		if(err) throw err;
		res.render('client', {
			result : results[0],
			res_cli : results[1]
		});
	});
});

//*************** FIN BACKEND CLIENT *************************








//************** BACKEND COMMANDE ****************************

// Route pour la liste des commandes
app.get('/commandes', function (req, res, next) {
	let queries = ["SELECT distinct client.nomClient, achat.numClient from client, achat WHERE client.numClient = achat.numClient",
					"SELECT * from client",
					"SELECT * from materiel"];
	conn.query(queries.join(';'), function (error, result, fields) {

		if (error) throw error;

		res.render('commande', {
			comm: result[0],
			cli: result[1],
			mat: result[2]


		});
	
	});
});

// Ajout d'un nouvel commande
app.post('/com', (req, res) =>{
	let data = {
		numClient: req.body.nom_client,
		numMat: req.body.product_name,
		quantite: req.body.quantity,
		date_cm: req.body.date_c
	};
	let queries = ["INSERT INTO achat SET ?",
					"UPDATE materiel SET stock = stock - '"+req.body.quantity+"' WHERE numMat = "+req.body.product_name,
					"INSERT IGNORE INTO mvt_sort (cle_design, date_sort, quantite_sort) VALUES ('"+req.body.product_name+"', '"+req.body.date_c+"', '"+req.body.quantity+"')" ];
	let query = conn.query(queries.join(';'), data, (err, result) =>{
		if(err) throw err;
		res.redirect('/commandes');
	});
});







//**************** FIN BACKEND COMMANDE ********************







//**************** BACKEND FACTURE ************************


//Route vers facture
app.get('/factures/:numClient', (req, res) => {
	let queries = ["SELECT numFacture, materiel.numMat as cleMat, design, prixUnit, quantite, nomclient,date_cm, quantite*prixUnit AS montant FROM materiel, client, achat WHERE achat.numClient = client.numClient AND materiel.numMat = achat.numMat AND client.numClient = "+[req.params.numClient]+"",
					"SELECT sum(quantite*prixUnit) AS tot FROM materiel, achat where materiel.numMat = achat.numMat and achat.numClient = "+[req.params.numClient]+"" ];
	let query = conn.query(queries.join(';'), (err, results) => {
		if(err) throw err;
		
		res.render('facture', {
			results: results[0],
			chi : results[1],
		});
	});
}); 

//Editer commande dans facture
app.post('/edtfct', (req, res) => {
	//ETO TSIKA ZAO
	let queries = ["UPDATE materiel SET stock = (CASE WHEN '"+req.body.qtte+"' < '"+req.body.product_quantity+"' THEN stock - ( '"+req.body.product_quantity+"' - '"+req.body.qtte+"' ) WHEN '"+req.body.qtte+"' > '"+req.body.product_quantity+"' THEN stock + ( '"+req.body.qtte+"' - '"+req.body.product_quantity+"' ) ELSE stock END ) WHERE numMat = "+req.body.cle_mat,
				  "UPDATE achat SET quantite = '"+req.body.product_quantity+"' WHERE numFacture =" +req.body.id];
	let query = conn.query(queries.join(';'), (err, results) => {
		if(err) throw err;
		res.redirect('/commandes');
	});
});

//Supprimer commande dans facture
app.post('/suppfct', (req, res) =>{
	let queries = ["DELETE from achat WHERE achat.numFacture = "+req.body.num_facture+"",
					"UPDATE materiel SET stock = stock + '"+req.body.product_quantity+"' WHERE numMat =" +req.body.product_id ];
	let query = conn.query(queries.join(';'), (err, results) =>{
		if(err) throw err;
		res.redirect('/commandes');
	});
});

//*************** FIN BACKEND FACTURE *********************



//*************** BACKEND MOUVEMENT STOCK ********************
//AFFICHAGE page mouvement entrée et ses contenus 
app.get('/mouvements', (req, res) =>{
	let sql = "SELECT * from mvt_ent";
	let query = conn.query(sql, (err, results ) =>{

		if (err) throw err;
		res.render('mouvement', {
			entree : results

		});

	});
});

//AFFICHAGE page mouvement sortie et ses contenus
app.get('/sorties', (req, res) =>{
	let sql = "SELECT date_sort, design, quantite_sort from materiel, mvt_sort WHERE materiel.numMat = mvt_sort.cle_design";
	let query = conn.query(sql, (err, results) =>{

		if (err) throw err;
		res.render('sortie', {
			sortie : results
		});
	});
});


//RECHERCHE etat de stock en une année pour entrée
app.post('/rechEnt', (req, res) =>{
	let queries = ["SELECT * from mvt_ent",
			      "SELECT design, sum(quantite_ent) as somm_ent FROM mvt_ent WHERE year(date_ent) = '"+req.body.rech_date_ent+"' and design = '"+req.body.ent_design+ "'"];
	let query = conn.query(queries.join(';'), (err, results) =>{

		if(err) throw err;
		res.render('mouvement', {
			entree : results[0],
			rech_ent : results[1]
		});
	});
});


//RECHERCHE etat de stock en une année pour sortie
app.post('/rechSort', (req, res) =>{
	let queries = ["SELECT date_sort, design, quantite_sort from materiel, mvt_sort WHERE materiel.numMat = mvt_sort.cle_design",
			   "SELECT design, sum(quantite_sort) as somme FROM materiel, mvt_sort WHERE materiel.numMat = mvt_sort.cle_design AND materiel.design = '"+req.body.sort_design+"' AND year(date_sort) = '"+req.body.rech_date_sort+"' "];
	let query = conn.query(queries.join(';'), (err, results) =>{

		if(err) throw err;
		res.render('sortie', {
			sortie : results[0],
			rech_sort : results[1]
		});
	});
});
//*************** FIN BACKEND MOUVEMENT STOCK ****************


// Ecoute du serveur
app.listen(3000, () => {
	console.log('Le serveur tourne sur le port 3000');
	//console.log(viewPaths);
});
