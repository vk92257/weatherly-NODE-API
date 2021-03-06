const path = require('path');
const express = require('express');
const hbs = require('hbs');
const cors = require('cors');
const GeoCode = require('./utils/GeoCode');
const Forecast = require('./utils/Forecast');

const app = express();
const port = process.env.PORT || 3000; // herokus port || defualt port(for localhost)

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views');
const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and 'views' location and partial
app.set('view engine', 'hbs');
app.set('views', viewsPath); 
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));
app.use(cors());  
//index will be referred automatically for homepage as index.html has a special meaning to the servers

app.get('', (req, res) => {
    res.render('index', {       //(./views/index.hbs) -full path is not required as views is the default folder to hbs file 
        title: 'Weather',
        name: 'LaDav'
    });     
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me!',
        name: 'LaDav' 
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help!',
        helpText: 'this is some helpfull text...',
        name: 'LaDav'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "address is required!"
        });
    }
    
    const address = req.query.address;//pending consider the case address entred is ''(empty)
    const unit = req.query.unit || 'si';
    const exclude = req.query.exclude;

    // as return statement is used above so i don't need an else clause
    GeoCode(address, (error, {longitude, latitude, location} = {}) => {
        if(error) {
            return res.send({error: `${error}`});
        }

        Forecast(longitude, latitude, unit, exclude, (error, forecastData) => {
            if(error) {
                return res.send({error: `${error}`});
            }
            // send forecast if everything gone well
            res.send({          // data will be send in JSON format automatically
                location,
                ...forecastData
            });
        });
    });
});

app.get('/products', (req, res) => {
    if(!req.query.location) {
        return res.send({
             error: 'location is required.'
        });
    }

    res.send({
        product: 'this the product name!'
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'help article not found!',
        name: 'LaDav' 
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found!',
        name: 'LaDav' 
    });
});

app.listen(port, () => {
    console.log(`server started successfully at ${port}`);
});