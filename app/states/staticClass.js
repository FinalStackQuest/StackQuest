
export class CharacterConstructor {
  constructor(type) {
    this.type = type
    this.stats = this.assignStats(type)
  }
  assignStats(type) {
    if (type === 'wizard') {
      return {
        hp: 100,
        attack: 10,
        defense: 4,
        speed: 6,
        weapon: {
          weaponName: 'staff',
          type: 'projectile',
          damage: 4
        },
        armor: {
          armorName: 'robe',
          block: 1
        }
      }
    } else if (type === 'cyborg') {
      return {
        hp: 150,
        attack: 7,
        defense: 5,
        speed: 4,
        weapon: {
          weaponName: 'iron fist',
          type: 'melee',
          damage: 4,
        },
        armor: {
          armorName: 'aluminum',
          block: 2
        }
      }
    } else {
      console.error('no matching types')
    }
  }
  changeEquip(type, newEquip) {
    this.stats[type] = newEquip
  }
  totalDamageSent() {
    return this.stats.attack + this.stats.weapon.damage
  }
  totalDamageReceived(attack) {
    this.hp -= attack - (this.stats.defense + this.stats.armor.block)
  }
  speak() {
    console.log(`my name is ${this.type}`)
  }
}
