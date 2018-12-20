'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B } = require('ranvier');
const Combat = require('../../bundle-example-combat/lib/Combat');

module.exports = {
  aliases: [ 'stats' ],
  command : (state) => (args, p) => {
    const say = message => B.sayAt(p, message);

    say('<b>' + B.center(60, `${p.name}, level ${p.level}`, 'green'));
    say('<b>' + B.line(60, '-', 'green'));

    let stats = {
      health: 0,
      strength: 0,
      endurance: 0,
      agility: 0,
      dexterity: 0,
      charisma: 0,
      intellect: 0,
      perception: 0,
    };

    for (const stat in stats) {
      stats[stat] = {
        current: p.getAttribute(stat) || 0,
        base: p.getBaseAttribute(stat) || 0,
        max: p.getMaxAttribute(stat) || 0,
      };
    }

    B.at(p, sprintf(' %-9s: %12s', 'Health', `${stats.health.current}/${stats.health.max}`));
    say('<b><green>' + sprintf(
      '%36s',
      'Weapon '
    ));

    B.at(p, sprintf('%37s', '|'));
    const weaponDamage = Combat.getWeaponDamage(p);
    const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
    const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
    say(sprintf(' %6s:<b>%5s</b> - <b>%-5s</b> |', 'Damage', min, max));
    B.at(p, sprintf('%37s', '|'));
    say(sprintf(' %6s: <b>%12s</b> |', 'Speed', B.center(12, Combat.getWeaponSpeed(p) + ' sec')));

    say(sprintf('%60s', "'" + B.line(22) + "'"));

    say('<b><green>' + sprintf(
      '%-24s',
      ' Stats'
    ) + '</green></b>');
    say('.' + B.line(22) + '.');


    const printStat = (stat, newline = true) => {
      const val = stats[stat];
      const statColor = (val.current > val.base ? 'green' : 'white');
      const str = sprintf(
        `| %-10s :<b><${statColor}>%8s</${statColor}></b> |`,
        stat[0].toUpperCase() + stat.slice(1),
        val.current
      );

      if (newline) {
        say(str);
      } else {
        B.at(p, str);
      }
    };

    printStat('strength', false); // left
    say('<b><green>' + sprintf('%36s', 'Gold ')); // right
    printStat('endurance', false); // left
    say(sprintf('%36s', '.' + B.line(12) + '.')); // right
    printStat('agility', false); // left
    say(sprintf('%22s| <b>%10s</b> |', '', p.getMeta('currencies.gold') || 0)); // right
    printStat('dexterity', false); // left
    say(sprintf('%36s', "'" + B.line(12) + "'")); // right
    printStat('charisma');
    printStat('intellect');
    printStat('perception');
    say(':' + B.line(22) + ':');
    
    /*
    printStat('armor');
    printStat('critical');
    say("'" + B.line(22) + "'");
    */
  }
};
