'use strict';

const { Player } = require('ranvier');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => (socket, args) => {
    let player = new Player({
      name: args.name,
      account: args.account,
    });

    for (const attr in args.att[0]) {
      player.addAttribute(state.AttributeFactory.create(attr, args.att[0][attr]));
    }

    args.account.addCharacter(args.name);
    args.account.save();

    const room = state.RoomManager.startingRoom;
    player.room = room;
    player.save();

    // reload from manager so events are set
    player = state.PlayerManager.loadPlayer(state, player.account, player.name);
    player.socket = socket;

    socket.emit('done', socket, { player });
  }
};
