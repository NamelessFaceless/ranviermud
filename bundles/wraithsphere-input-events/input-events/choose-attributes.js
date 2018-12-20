'use strict';

const { Broadcast, EventUtil } = require('ranvier');

/**
 * Player point distribution event
 */
module.exports = {
    event: state => (socket, args) => {
      const say = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      // Every stat starts at 0, except for hp.
      const startingAttributes = {
        health: 100,
        strength: 0,
        endurance: 0,
        agility: 0,
        dexterity: 0,
        charisma: 0,
        perception: 0,
        intellect: 0,
      };

      /* Player point distribution menu
        * Can select a stat and distribute x amount of points
      */
      say(' \r\n------------------------------');
      say(' |    Attribute Allocation');
      say(' ------------------------------');
      say(' TIP: You can type \'statname, amount\' to increase the stat.');
      say(' TIP: E.g: \'health, 5\'');

      /* This basically sets all the settings that need to be passed between 'choose-attributes' and 'distribute-attribute.'
      * Checks if the `args.attributes` object exists -- If it doesn't, it copies the object from the startingAttributes variable,
      * and assigns the attributeLimit, together with remainingPoints.
      */
      if(args.attributes === undefined) {
        args.attributes = Object.assign({}, startingAttributes);
        args.attributeLimit = 100;
        args.remainingPoints = 100;
      }
      
      say(`You have ${args.remainingPoints} left out of ${args.attributeLimit}.`);

      for (const stat in args.attributes) {
        say(`   ${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${args.attributes[stat]}`);
      }
      say('');
      write('> ');
      
      socket.once('data', choice => {
        choice = choice.includes(',') ? choice.toString().trim().split(',') : choice.toString().trim();

        if(choice instanceof Array) {
          if(args.attributes.hasOwnProperty(choice[0])) {
            if(args.remainingPoints >= choice[1]) {
              args.chosenAttribute = choice[0];
              args.attributes[args.chosenAttribute] += parseInt(choice[1]);

              if(args.attributes[args.chosenAttribute] < 0) {
                args.attributes[args.chosenAttribute] = 0;
                say(' <b> You can\'t reduce attributes below the minimum amount. </b>');
              }
              else
                args.remainingPoints -= parseInt(choice[1]);
            }
            else {
              say(' <b>Not enough points left.</b>');
            }
            return socket.emit('choose-attributes', socket, args);
          }
        }
        else {
          if(args.attributes.hasOwnProperty(choice)) {
            args.chosenAttribute = choice;

            return socket.emit('distribute-attribute', socket, args);
          }
        }

        if(!args.attributes.hasOwnProperty(choice) && choice !== 'done' || args.attributes.hasOwnProperty(choice[0] && choice !== 'done')) {
          say('');
          say('<b> Invalid attribute choice, please type one of the listed attributes.</b>');
          return socket.emit('choose-attributes', socket, args);
        }

        if(choice !== 'done' || !choice) {
          return socket.emit('choose-attributes', socket, args);
        }

        if(choice === 'done') {
          return socket.emit('finish-player', socket, args);
        }
      });
    }
}