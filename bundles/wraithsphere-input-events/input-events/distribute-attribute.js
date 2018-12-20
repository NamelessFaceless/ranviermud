'use strict';

const { Broadcast, EventUtil } = require('ranvier');

module.exports = {
  event: state => (socket, args) => {
    const say = EventUtil.genSay(socket);
    const write  = EventUtil.genWrite(socket);

    say(`How many points should be allocated to the ${args.chosenAttribute} attribute?`);
    say(`Currently ${args.att[0][args.chosenAttribute]} were put into ${args.chosenAttribute}`);

    write('> ');
    socket.once('data', choice => {
      choice = choice.toString().trim();
      
      // Sends the user back to the choose attribute window if they input 0
      if(choice === '0') {
        return socket.emit('choose-attributes', socket, args);
      }

      if(parseInt(choice)) {
        let increaseBy = parseInt(choice);
        args.att[0][args.chosenAttribute] += increaseBy;
        say(`The attribute ${args.chosenAttribute} was increased by ${choice}.`);
        say('');
        return socket.emit('choose-attributes', socket, args);
      }
      else {
        say(`Invalid value, please try again.`);
        return socket.emit('distribute-attributes', socket, args);
      }
    });
  }
}