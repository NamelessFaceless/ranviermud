'use strict';

const { Broadcast, EventUtil } = require('ranvier');

/**
 * Player point distribution event
 */
module.exports = {
    event: state => (socket, args) => {
      const say = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      // Every stat starts at 0, except for hp
      const attributes = {
        health: 100,
        strength: 0,
        endurance: 0,
        agility: 0,
        dexterity: 0,
        charisma: 0,
        perception: 0,
        intellect: 0,
      };

      // Sets the limit of attributes that should be spent and the amount of remaining points.
      const attributeLimit = 100;
      let remainingPoints = 100;

      /* Player point distribution menu
        * Can select a stat and distribute x amount of points
      */
      say(' Select an attribute to allocate points to')
      if(args.att === undefined) {
        for (const stat in attributes) {
          say(`${stat}: ${attributes[stat]}`);
        }
      }
      else {
        for(const stat in args.att[0]) {
          say(`${stat}: ${args.att[0][stat]}`);
        }
      }
      write('> ');
      
      socket.once('data', choice => {
        choice = choice.toString().trim();
        if(attributes.hasOwnProperty(choice) && args.att === undefined && choice !== 'done') {
          args.att = [];
          args.att.push(attributes);
          args.chosenAttribute = choice;
          return socket.emit('distribute-attribute', socket, args);
        }

        if(args.att[0].hasOwnProperty(choice) && args.att.length === 1 && choice !== 'done') {
          args.chosenAttribute = choice;
          return socket.emit('distribute-attribute', socket, args);
        }

        if(!attributes.hasOwnProperty(choice) && choice!== 'done') {
          say('<b>Invalid attribute choice</b>');
          return socket.emit('choose-attributes', socket, args);
        }

        if(attributes.hasOwnProperty(choice) && args.att.length === 1 && choice!== 'done') {
          return socket.emit('choose-attributes', socket, args);
        }

        if(!choice) {
          return socket.emit('choose-attributes', socket, args);
        }

        if(choice === 'done') {
          return socket.emit('finish-player', socket, args);
        }
      });
    }
}