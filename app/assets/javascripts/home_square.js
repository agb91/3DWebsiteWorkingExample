jQuery(document).ready(function() {

      var table = [
        "A", "Primo", "1", 1, 1,
        "B", "Secondo", "2", 2, 1,
        "C", "Terzo", "3", 3, 1,
        "D", "Quarto", "4", 4, 1,
        "E", "Cinque", "5", 5, 1,
        "F", "Sei", "6", 6, 1,
        "G", "Sette", "7", 7, 1,
        "H", "Otto", "8", 8, 1,
        "I", "Nove", "9", 9, 1,
        "J", "Dieci", "10", 1, 2,
        "K", "Undici", "11", 2, 2,
        "L", "Dodici", "12", 3, 2,
        "M", "Tredici", "13", 4, 2,
        "N", "Fourteen", "13", 5, 2,
        "O", "Quindici", "15", 6, 2,
        "P", "Sedici", "16", 7, 2,
        "Q", "7teen", "17", 8, 2,
        "R", "Diciotto", "18", 9, 2,
        "S", "Dicia9", "19", 1, 3,
        "T", "Venti", "20", 2, 3,
        "U", "Ventuno", "21", 3, 3,
        "V", "Venti2", "22", 4, 3,
        "W", "Venti3", "23", 5, 3,
        "X", "Venti4", "24", 6, 3,
        "Y", "Venti5", "25", 7, 3,
        "Z", "Venti6", "26", 8, 3,
        "@", "Venti7", "27", 9, 3,
        "a", "Vent8", "28", 1, 4,
        "b", "Venti9", "29", 2, 4,
        "c", "Trenta", "30", 3, 4,
        "d", "30Uno", "31", 4, 4,
        "e", "Trenta2", "32", 5, 4,
        "f", "Trenta3", "33", 6, 4,
        "g", "Trenta4", "34", 7, 4,
        "h", "Trenta5", "35", 8, 4,
        "i", "Trenta6", "36", 9, 4,
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

        for ( var i = 0; i < table.length; i += 5 ) {

          var element = document.createElement( 'div' );
          element.className = 'element-s';
          element.style.backgroundColor = 'rgba(' +
               127 +
                 ',' + Math.floor(Math.random()*255)
                + ',' + Math.floor(Math.random()*255) + ','
                + ( Math.random() * 0.5 + 0.25 ) + ')';

          var number = document.createElement( 'div' );
          number.className = 'number-s';
          number.textContent = (i/5) + 1;
          element.appendChild( number );

          var symbol = document.createElement( 'div' );
          symbol.className = 'symbol-s';
          symbol.textContent = table[ i ];
          element.appendChild( symbol );

          var details = document.createElement( 'div' );
          details.className = 'details-s';
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
          object.position.x = ( table[ i + 3 ] * 260 ) - 1330;
          object.position.y = - ( table[ i + 4 ] * 300 ) + 990;

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

          object.position.x = 1500 * Math.sin( phi );
          object.position.y = - ( i * 30 ) + 450;
          object.position.z = 1500 * Math.cos( phi );

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
        document.getElementById( 'container-s' ).appendChild( renderer.domElement );

        //

        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', render );

        var button = document.getElementById( 'table-s' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.table, 2000 );

        }, false );

        var button = document.getElementById( 'sphere-s' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.sphere, 2000 );

        }, false );

        var button = document.getElementById( 'helix-s' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.helix, 2000 );

        }, false );

        var button = document.getElementById( 'grid-s' );
        button.addEventListener( 'click', function ( event ) {

          transform( targets.grid, 2000 );

        }, false );

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