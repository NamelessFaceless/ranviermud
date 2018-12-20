'use strict';

const { EventUtil } = require('ranvier');

/**
 * Confirm new player name
 */
module.exports = {
  event: state => (socket, args) => {
    const say = EventUtil.genSay(socket);
    const write  = EventUtil.genWrite(socket);

    write(`<bold>${args.name} doesn't exist, would you like to create it?</bold> <cyan>[y/n]</cyan> `);
    socket.once('data', confirmation => {
      say('');
      confirmation = confirmation.toString().trim().toLowerCase();

      if (!/[yn]/.test(confirmation)) {
        return socket.emit('player-name-check', socket, args);
      }

      if (confirmation === 'n') {
        say(`Let's try again...`);
        return socket.emit('create-player', socket, args);
      }

      // changed 'choose-class' to 'finish-player' instead, to completely skip the choose class step, and into the end since there's no classes on Wraithsphere.
      socket.emit('choose-attributes', socket, args);
    });
  }
};
