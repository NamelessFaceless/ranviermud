'use strict';

const { Broadcast, EventUtil } = require('ranvier');

module.exports = {
  event: state => (socket, args) => {
    const say = EventUtil.genSay(socket);
    const write  = EventUtil.genWrite(socket);

    say(`How many points should be allocated to the ${args.chosenAttribute} attribute?`);
    say(`Currently ${args.attributes[args.chosenAttribute]} were put into ${args.chosenAttribute}`);

    write('> ');
    socket.once('data', choice => {      
      // Sends the user back to the choose attribute window if they input 0
      if(choice === 0) {
        return socket.emit('choose-attributes', socket, args);
      }
      
      // Checks if it's a Integer, converted from a string -- If not, just tells the user the value is invalid and re-sends it.
      if(parseInt(choice)) {
        if(args.remainingPoints >= parseInt(choice)) {
          args.attributes[args.chosenAttribute] += parseInt(choice);
          say(` The attribute ${args.chosenAttribute} was increased by ${choice}.`);

          if(args.attributes[args.chosenAttribute] < 0) {
            args.attributes[args.chosenAttribute] = 0;
            say(' <b> You can\'t reduce attributes below the minimum amount. </b>');
          }
          else {
            args.remainingPoints -= parseInt(choice);
            return socket.emit('choose-attributes', socket, args);
          }
        }
        else {
          say(' Not enough points left.');
          return socket.emit('choose-attributes', socket, args);
        }
      }
        //
    });
  }
}