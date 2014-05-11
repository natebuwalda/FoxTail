'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing'),
  Product = mongoose.model('Product');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Thing.find({}).remove(function() {
  Thing.create({
    name : 'HTML5 Boilerplate',
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
    awesomeness: 10
  }, {
    name : 'AngularJS',
    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
    awesomeness: 10
  }, {
    name : 'Karma',
    info : 'Spectacular Test Runner for JavaScript.',
    awesomeness: 10
  }, {
    name : 'Express',
    info : 'Flexible and minimalist web application framework for node.js.',
    awesomeness: 10
  }, {
    name : 'MongoDB + Mongoose',
    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
    awesomeness: 10
  }, function() {
      console.log('finished populating things');
    }
  );
});

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Product.find({}).remove(function () {
  Product.create(
    {"title": "Bag - Medium",
      "link": "products/Bag-Medium.html",
      "desc": "The 'Standard' size of our dicebag, holding approx. 50 dice of normal size.  Two colors, 14g AWG/1.6mm rings, leather cord and cord stop.",
      "img": "images/gallery/Bag-Dicebag-05-g.png",
      "price": "$40.00"
    }, 
    {"title": "Bracelet - Alligator Back",
      "link": "products/Bracelet-Alligator-Back.html",
      "desc": "Two to three colors, 14g AWG/1.6mm rings, Tube Clasp or spacer and any other clasp.",
      "img": "images/gallery/Bracelet-Alligator-Back-01-g.jpg",
      "price": "$20.00"
    },
    {"title": "Bracelet - GSG",
      "link": "products/Bracelet-GSG.html",
      "desc": "Two to three colors, 14g AWG/1.6mm rings, lobster claw clasp.",
      "img": "images/gallery/Bracelet-GSG-01-g.jpg",
      "price": "$20.00"
    },
    {"title": "Bracelet - Half Persian 3-in-1",
      "link": "products/Bracelet-HP3-in-1.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp.",
      "img": "images/gallery/Bracelet-HP3-in-1-01-g.jpg",
      "price": "$15.00"
    }, 
    {"title": "Bracelet - Half Persian 4-in-1",
      "link": "products/Bracelet-HP4-in-1.html",
      "desc": "A much tighter weave than Half Persian 3-in-1, it holds it's shape nicely at all times.  Two colors, 14g AWG/1.6mm rings, lobster claw clasp.",
      "img": "images/gallery/Bracelet-HP4-in-1-01-g.jpg",
      "price": "$15.00"
    },
    {"title": "Bracelet - Mobius Flower",
      "link": "products/Bracelet-Mobius-Flower.html",
      "desc": "Mobius flowers are done in one or two colors per flower, then another color for connectors.  Additional flower colors cost extra.  14g AWG/1.6mm rings, lobster claw clasp.",
      "img": "images/gallery/Bracelet-Mobius-Flower-01-g.png",
      "price": "$15.00"
    },
    {"title": "Bracelet - Byzantine",
      "link": "products/Bracelet-Byzantine.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in Copper and Brass.",
      "img": "images/gallery/Bracelet-Byzantine-01-g.jpg",
      "price": "$20.00"
    }, 
    {"title": "Bracelet - Byzantine Sheet (3 row)",
      "link": "products/Bracelet-Byzantine-Sheet.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in Copper, Bronze, and Brass.",
      "img": "images/gallery/Bracelet-Byzantine-Sheet-01-g.jpg",
      "price": "$30.00"
    },
    {"title": "Bracelet - Dragonscale (3 row)",
      "link": "products/Bracelet-Dragonscale.html",
      "desc": "So named for the scale-layer like effect, despite not using actual scales to make it.  Two colors, 16g AWG/1.2mm rings and 14g AWG/1.6mm rings, tube clasp or spacer and other clasps, pictured in copper and brass.  Five row is available for $40.",
      "img": "images/gallery/Bracelet-Dragonscale-01-g.jpg",
      "price": "$30.00"
    },
    {"title": "Bracelet - Full Persian",
      "link": "products/Bracelet-Full-Persian.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in copper and bronze.",
      "img": "images/gallery/Bracelet-Full-Persian-01-g.jpg",
      "price": "$20.00"
    }, 
    {"title": "Bracelet - Mars",
      "link": "products/Bracelet-Mars.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in copper and brass.",
      "img": "images/gallery/Bracelet-Mars-01-g.jpg",
      "price": "$20.00"
    },
    {"title": "Bracelet - Dragonsteps",
      "link": "products/Bracelet-Dragonsteps.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in aluminium and bronze.",
      "img": "images/gallery/Bracelet-Dragonsteps-01-g.jpg",
      "price": "$20.00"
    },
    {"title": "Bracelet - Celtic Spiral Knot",
      "link": "products/Bracelet-Celtic-Spiral-Knot.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in aluminium and bronze.",
      "img": "images/gallery/Bracelet-CelticSpiralKnot-01-g.jpg",
      "price": "$20.00"
    }, 
    {"title": "Bracelet - Elfin",
      "link": "products/Bracelet-Elfin.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in aluminium and bronze.",
      "img": "images/gallery/Bracelet-Elfin-01-g.jpg",
      "price": "$20.00"
    },
    {"title": "Bracelet - Elfweave",
      "link": "products/Bracelet-Elfweave.html",
      "desc": "Two colors, 16g AWG/1.2mm rings, lobster claw clasp, pictured in aluminium and bronze.",
      "img": "images/gallery/Bracelet-Elfweave-01-g.jpg",
      "price": "$30.00"
    },
    {"title": "Necklace - Byzantine and Mobius Flower",
      "link": "products/Necklace-Byzantine-and-Mobius-Flower.html",
      "desc": "Custom commission.  16g AWG/1.2mm rings for most, 14g AWG/1.6mm rings for the Mobius flower sections.",
      "img": "images/gallery/Necklace-Byzantine-and-Mobius-Flower-01-g.jpg",
      "price": "$65.00"
    }, 
    {"title": "Keychain - Full Persian with Mobius Flower",
      "link": "Keychain-Full-Persian.html",
      "desc": "A keychain, pictured above in plain aluminium, this can also be made in stainless steel as well as the base metals. 14g AWG/1.6mm rings, single color.",
      "img": "images/gallery/Keychain-Full-Persian-01-g.jpg",
      "price": "$5.00"
    }, function() {
      console.log('finished populating products');
      }
    );
});