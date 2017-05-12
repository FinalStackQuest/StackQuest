/* global StackQuest, Phaser */

const createProjectile = {
  bullet(playerObject) {
    //  Creates 3 bullets, using the 'bullet' graphic
    const projectile = StackQuest.game.add.weapon(3, 'bullet')

    //  The bullet will be automatically killed when it leaves the world bounds
    projectile.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    //  The speed at which the bullet is fired
    projectile.bulletSpeed = 2000

    //  Speed-up the rate of fire, allowing them to shoot 3 bullet every second
    projectile.fireRate = 333

    //  Tell the Weapon to track the 'player' Sprite
    //  With no offsets from the position
    //  But the 'true' argument tells the weapon to track sprite rotation
    projectile.trackSprite(playerObject, 0, 0, true)

    // console.log('playerObj in projectile:', playerObject)
    // //  adds damage associated with that player
    projectile.damage = playerObject.internalStats.stats.attack

    return projectile
  }
}

export default createProjectile
