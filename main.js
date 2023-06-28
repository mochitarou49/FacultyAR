import { loadGLTF, loadVideo } from './libs/loader.js';


const THREE = window.MINDAR.IMAGE.THREE;

/**
 * HTMLがロードされた時に実行される
 */
document.addEventListener('DOMContentLoaded', async () => {
  let mindarThree = null;
  
  let font = null;
  const fontLoader = new THREE.FontLoader();
  fontLoader.load('../assets/fonts/helvetiker_regular.typeface.json', (_font) => {
    font = _font;
  });

  const makeVideoPlane = async (videoPath) => {
    const video = await loadVideo(videoPath);
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(1, 270 / 480);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    video.addEventListener('play', () => {
      video.currentTime = 0;
    });
    return {
      plane: plane,
      video: video,
    };
  }

  const makeTextMesh = (text) => {
    const textMesh = new THREE.Mesh(
      new THREE.TextGeometry(text, {
        font: font, // フォントを指定 (FontLoaderで読み込んだjson形式のフォント)
        size: 0.1,   // 文字のサイズを指定
        height: 0.01,  // 文字の厚さを指定
      }),
      new THREE.MeshBasicMaterial({
        color: `#ccc`, // 文字の色
      })
    );
    return textMesh;
  };

  const loadDisney = async () => {

    const videoSet = await makeVideoPlane('assets/videos/Disney.mp4');
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(videoSet.plane);
    anchor.onTargetFound = () => {
      videoSet.video.play();
    }
    anchor.onTargetLost = () => {
      videoSet.video.pause();
    }
    const textMesh = makeTextMesh('Disney');
    anchor.group.add(textMesh);

  }

  const loadSnow = async () => {
    const videoSet = await makeVideoPlane('assets/videos/snow.mp4');
    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(videoSet.plane);
    anchor.onTargetFound = () => {
      videoSet.video.play();
    }
    anchor.onTargetLost = () => {
      videoSet.video.pause();
    }
    const textMesh = makeTextMesh('Disney');
    anchor.group.add(textMesh);
  };

  const Start = async () => {

    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/targets.mind',
    });
    const { renderer, scene, camera } = mindarThree;
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

  }

  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', Start);
  const startSnowButton = document.getElementById('start-snow-button');
  startSnowButton.addEventListener('click', loadSnow);
  const startDesneyButton = document.getElementById('start-disney-button');
  startDesneyButton.addEventListener('click', loadDisney);
});
