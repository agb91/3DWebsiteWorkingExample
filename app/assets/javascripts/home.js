jQuery(document).ready(function() {

      var table = [
        "A", "Primo", "1", 1, 1,
        "B", "Secondo", "2", 2, 1,
        "C", "Terzo", "3", 3, 1,
        "D", "Quarto", "4", 4, 1,
        "E", "Cinque", "5", 5, 1,

        "F", "Sei", "6", 1, 2,
        "G", "Sette", "7", 2, 2,
        "H", "Otto", "8", 3, 2,
        "I", "Nove", "9", 4, 2,
        "J", "Dieci", "10", 5, 2,

        "K", "Undici", "11", 1, 3,
        "L", "Dodici", "12", 2, 3,
        "M", "Tredici", "13", 3, 3,
        "N", "Fourteen", "13", 4, 3,
        "O", "Quindici", "15", 5, 3,

        "P", "Sedici", "16", 1, 4,
        "Q", "7teen", "17", 2, 4,
        "R", "Diciotto", "18", 3, 4,
        "S", "Dicia9", "19", 4, 4,
        "T", "Venti", "20", 5, 4,

        "U", "Ventuno", "21", 1, 5,
        "V", "Venti2", "22", 2, 5,
        "W", "Venti3", "23", 3, 5,
        "X", "Venti4", "24", 4, 5,
        "Y", "Venti5", "25", 5, 5,

        /*"Z", "Venti6", "26", 8, 3,
        "@", "Venti7", "27", 9, 3,
        "a", "Vent8", "28", 1, 4,
        "b", "Venti9", "29", 2, 4,
        "c", "Trenta", "30", 3, 4,
        "d", "30Uno", "31", 4, 4,
        "e", "Trenta2", "32", 5, 4,
        "f", "Trenta3", "33", 6, 4,
        "g", "Trenta4", "34", 7, 4,
        "h", "Trenta5", "35", 8, 4,
        "i", "Trenta6", "36", 9, 4,*/
      ];

      var camera, scene, renderer;
      var controls;

      var objects = [];
      var targets = { table: [], sphere: [], helix: [], grid: [] };

      init();
      animate();

      function init() {

        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 2, 10000 );
        camera.position.z = 3000;

        scene = new THREE.Scene();

        // table
        var cont = 0;
        for ( var i = 0; i < table.length; i += 5 ) {
          cont++;
          var element = document.createElement( 'div' );
          element.className = 'element';

          var number = document.createElement( 'div' );
          number.className = 'number';
          number.textContent = (i/5) + 1;
          element.appendChild( number );

          var symbol = document.createElement( 'div' );
          symbol.className = 'symbol';
          symbol.textContent = table[ i ];
          element.appendChild( symbol );

          var details = document.createElement( 'div' );
          details.className = 'details';
          details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
          element.appendChild( details );

          //SOTTO SOLO POSIZIONI DI PARTENZA
          var object = new THREE.CSS3DObject( element );
          object.position.x = Math.random() * 4000 - 2000;
          object.position.y = Math.random() * 4000 - 2000;
          object.position.z = Math.random() * 4000 - 2000;
          scene.add( object );

          objects.push( object );

          //

          var object = new THREE.Object3D();
          var offset = 0;
          if(cont % 10 == 6 || cont % 10 == 7 || cont % 10 == 8 || cont % 10 == 9 || cont % 10 == 0)
          {
            offset = 200;
          }
          object.position.x = ( table[ i + 3 ] * 400 ) - 1330 + offset;
          object.position.y = - ( table[ i + 4 ] * 350 ) + 990;

          targets.table.push( object );

        }

        // sphere

        var vector = new THREE.Vector3();

        for ( var i = 0, l = objects.length; i < l; i ++ ) {

          var phi = Math.acos( -1 + ( 2 * i ) / l );
          var theta = Math.sqrt( l * Math.PI ) * phi;

          var object = new THREE.Object3D();

          object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
          object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
          object.position.z = 800 * Math.cos( phi );

          vector.copy( object.position ).multiplyScalar( 2 );

          object.lookAt( vector );

          targets.sphere.push( object );

        }

        // helix

        var vector = new THREE.Vector3();

        for ( var i = 0, l = objects.length; i < l; i ++ ) {

          var phi = i * 0.175 + Math.PI;

          var object = new THREE.Object3D();

          object.position.x = 1000 * Math.sin( phi );
          object.position.y = - ( i * 30 ) + 450;
          object.position.z = 1000 * Math.cos( phi );

          vector.x = object.position.x * 2;
          vector.y = object.position.y;
          vector.z = object.position.z * 2;

          object.lookAt( vector );

          targets.helix.push( object );

        }

        // grid

        for ( var i = 0; i < objects.length; i ++ ) {

          var object = new THREE.Object3D();

          object.position.x = ( ( i % 5 ) * 400 ) - 800;
          object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
          object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

          targets.grid.push( object );

        }

        //

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        if(document.getElementById( 'container' ))
        {
          document.getElementById( 'container' ).appendChild( renderer.domElement );
        }

        //

        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );


        var button = document.getElementById( 'table' );
        if(button)
        {
          button.addEventListener( 'click', function ( event ) {

            transform( targets.table, 2000 );

          }, false );
        }


        var button = document.getElementById( 'sphere' );
        if(button)
        {
          button.addEventListener( 'click', function ( event ) {

            transform( targets.sphere, 2000 );

          }, false );
        }

        var button = document.getElementById( 'helix' );
        if(button)
        {
          button.addEventListener( 'click', function ( event ) {

            transform( targets.helix, 2000 );

          }, false );
        }

        var button = document.getElementById( 'grid' );
        if(button)
        {
          button.addEventListener( 'click', function ( event ) {

            transform( targets.grid, 2000 );

          }, false );
        }

        transform( targets.table, 2000 );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function transform( targets, duration ) {

        TWEEN.removeAll();

        for ( var i = 0; i < objects.length; i ++ ) {

          var object = objects[ i ];
          var target = targets[ i ];

          new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

          new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        }

        new TWEEN.Tween( this )
          .to( {}, duration * 2 )
          .onUpdate( render )
          .start();

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

      }

      function animate() {

        requestAnimationFrame( animate );

        TWEEN.update();

        controls.update();

      }

      function render() {

        renderer.render( scene, camera );

      }
})