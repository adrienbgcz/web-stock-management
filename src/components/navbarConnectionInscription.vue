<template>
  <div class="h-25/100 flex" >
    <div class="w-50/100 p-5">
      <router-link to="/">
        <img src="./../assets/images/logo.png" alt="logo">
      </router-link>
    </div>
    <div class="flex justify-end w-50/100">
      <router-link to="/login">
          <div class="portfolio-experiment--modif tailleDivBouton p-3">
              <a>
                <span class="text">Connexion</span>
                <span class="line -right"></span>
                <span class="line -top"></span>
                <span class="line -left"></span>
                <span class="line -bottom"></span>
              </a>
          </div> 
      </router-link>
      <router-link to="/inscription">
          <div class="portfolio-experiment--modif tailleDivBouton p-3">
              <a>
                <span class="text">Inscription</span>
                <span class="line -right"></span>
                <span class="line -top"></span>
                <span class="line -left"></span>
                <span class="line -bottom"></span>
              </a>
          </div>
      </router-link>
    </div>
  </div>  
</template>
<script>

export default {
  name: 'navbarAccueil',
  components: {
  }
}

</script>

<style lang="scss">

$thick : 3px;
$pad : 0.7em;
$extra : calc(#{$pad} * 1.2);
$color : #00E1FF;

//Animation logo Connexion
.portfolio-experiment--modif {
  background: #13161C;
  
  a {
    color: #00E1FF;
    padding: $pad $extra;
    display: inline-block;
    border: $thick solid transparent;
    position: relative;
    font-size: 1.5em;
    cursor: pointer;
    letter-spacing: 0.07em;

    .text {
      // padding: 0 0.3em;
      font-family: proxima-nova, monospace;
      transform: translate3d(0,$pad,0);
      display: block;
      transition: transform 0.4s cubic-bezier(.2,0,0,1) 0.4s;
      color: #00E1FF
    }

    &:after {
      position: absolute;
      content: '';
      bottom: -$thick;
      left: $extra;
      right: $extra;
      height: $thick;
      background: $color;
      // z-index: -1;
      transition: 
        transform 0.8s cubic-bezier(1,0,.37,1) 0.2s,
        right 0.2s cubic-bezier(.04,.48,0,1) 0.6s,
        left 0.4s cubic-bezier(.04,.48,0,1) 0.6s;
      transform-origin: left;
    }

  }

  .line {
    position: absolute;
    background: $color;

    &.-right,
    &.-left {
      width: $thick;
      bottom: -$thick;
      top: -$thick;
      transform: scale3d(1,0,1);
    }  

    &.-top,
    &.-bottom {
      height: $thick;
      left: -$thick;
      right: -$thick;
      transform: scale3d(0,1,1);
    }

    &.-right {
      right: -$thick;
      transition: transform 0.1s cubic-bezier(1,0,.65,1.01) 0.23s;
      transform-origin: top;
    }

    &.-top {
      top: -$thick;
      transition: transform 0.08s linear 0.43s;
      transform-origin: left;
    }

    &.-left {
      left: -$thick;
      transition: transform 0.08s linear 0.51s;
      transform-origin: bottom;
    }

    &.-bottom {
      bottom: -$thick;
      transition: transform 0.3s cubic-bezier(1,0,.65,1.01);
      transform-origin: right;
    }  
  }

  a:hover,
  a:active {

    .text {
      transform: translate3d(0,0,0);
      transition: transform 0.6s cubic-bezier(.2,0,0,1) 0.4s;
    }

    &:after {
      transform: scale3d(0,1,1);
      right: -$thick;
      left: -$thick;
      transform-origin: right;
      transition: 
        transform 0.2s cubic-bezier(1,0,.65,1.01) 0.17s,
        right 0.2s cubic-bezier(1,0,.65,1.01),
        left 0s 0.3s;
    }

    .line {
      transform: scale3d(1,1,1);

      &.-right {
        transition: transform 0.1s cubic-bezier(1,0,.65,1.01) 0.2s;
        transform-origin: bottom;
      }

      &.-top {
        transition: transform 0.08s linear 0.4s;
        transform-origin: right;
      }

      &.-left {
        transition: transform 0.08s linear 0.48s;
        transform-origin: top;
      }

      &.-bottom {
        transition: transform 0.5s cubic-bezier(0,.53,.29,1) 0.56s;
        transform-origin: left;
      }
    }

  }
}
$thick : 3px;
$pad : 0.7em;
$extra : calc(#{$pad} * 1.2);
$color : #13161C;

//////////////

//Animation logo Inscription
.portfolio-experiment {
  background: #00E1FF;
  
  a {
    color: #13161C;
    padding: $pad $extra;
    display: inline-block;
    border: $thick solid transparent;
    position: relative;
    font-size: 1.5em;
    cursor: pointer;
    letter-spacing: 0.07em;

    .text {
      // padding: 0 0.3em;
      font-family: proxima-nova, monospace;
      transform: translate3d(0,$pad,0);
      display: block;
      transition: transform 0.4s cubic-bezier(.2,0,0,1) 0.4s;
      color: #13161C
    }

    &:after {
      position: absolute;
      content: '';
      bottom: -$thick;
      left: $extra;
      right: $extra;
      height: $thick;
      background: $color;
      // z-index: -1;
      transition: 
        transform 0.8s cubic-bezier(1,0,.37,1) 0.2s,
        right 0.2s cubic-bezier(.04,.48,0,1) 0.6s,
        left 0.4s cubic-bezier(.04,.48,0,1) 0.6s;
      transform-origin: left;
    }

  }

  .line {
    position: absolute;
    background: $color;

    &.-right,
    &.-left {
      width: $thick;
      bottom: -$thick;
      top: -$thick;
      transform: scale3d(1,0,1);
    }  

    &.-top,
    &.-bottom {
      height: $thick;
      left: -$thick;
      right: -$thick;
      transform: scale3d(0,1,1);
    }

    &.-right {
      right: -$thick;
      transition: transform 0.1s cubic-bezier(1,0,.65,1.01) 0.23s;
      transform-origin: top;
    }

    &.-top {
      top: -$thick;
      transition: transform 0.08s linear 0.43s;
      transform-origin: left;
    }

    &.-left {
      left: -$thick;
      transition: transform 0.08s linear 0.51s;
      transform-origin: bottom;
    }

    &.-bottom {
      bottom: -$thick;
      transition: transform 0.3s cubic-bezier(1,0,.65,1.01);
      transform-origin: right;
    }  
  }

  a:hover,
  a:active {

    .text {
      transform: translate3d(0,0,0);
      transition: transform 0.6s cubic-bezier(.2,0,0,1) 0.4s;
    }

    &:after {
      transform: scale3d(0,1,1);
      right: -$thick;
      left: -$thick;
      transform-origin: right;
      transition: 
        transform 0.2s cubic-bezier(1,0,.65,1.01) 0.17s,
        right 0.2s cubic-bezier(1,0,.65,1.01),
        left 0s 0.3s;
    }

    .line {
      transform: scale3d(1,1,1);

      &.-right {
        transition: transform 0.1s cubic-bezier(1,0,.65,1.01) 0.2s;
        transform-origin: bottom;
      }

      &.-top {
        transition: transform 0.08s linear 0.4s;
        transform-origin: right;
      }

      &.-left {
        transition: transform 0.08s linear 0.48s;
        transform-origin: top;
      }

      &.-bottom {
        transition: transform 0.5s cubic-bezier(0,.53,.29,1) 0.56s;
        transform-origin: left;
      }
    }

  }
}

</style>