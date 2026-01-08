/**
 * 비디오 관련 기본 클래스
 * @module VideoBase
 */
class VideoBase {
  constructor(config = {}) {
    this.config = {
      autoplay: false,
      controls: true,
      loop: false,
      muted: false,
      ...config,
    };
  }

  /**
   * YouTube 비디오 URL 생성
   * @param {string} videoId - YouTube 비디오 ID
   * @param {Object} options - 추가 옵션
   * @returns {string}
   */
  static getYouTubeUrl(videoId, options = {}) {
    const {
      autoplay = 0,
      controls = 1,
      loop = 0,
      muted = 0,
      rel = 0,
      modestbranding = 1,
      start = 0,
    } = options;

    const params = new URLSearchParams({
      autoplay,
      controls,
      loop,
      muted,
      rel,
      modestbranding,
      ...(start > 0 && { start }),
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  /**
   * YouTube 썸네일 URL 생성
   * @param {string} videoId - YouTube 비디오 ID
   * @param {string} quality - 품질 (default, hq, mq, sd, maxres)
   * @returns {string}
   */
  static getYouTubeThumbnail(videoId, quality = "sddefault") {
    const qualities = {
      default: "default.jpg",
      hq: "hqdefault.jpg",
      mq: "mqdefault.jpg",
      sd: "sddefault.jpg",
      maxres: "maxresdefault.jpg",
    };

    const thumbnailFile = qualities[quality] || qualities.sd;
    return `https://img.youtube.com/vi/${videoId}/${thumbnailFile}`;
  }

  /**
   * 비디오 ID 추출 (YouTube URL에서)
   * @param {string} url - YouTube URL
   * @returns {string|null}
   */
  static extractYouTubeId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * 비디오 iframe 생성
   * @param {string} videoId - 비디오 ID
   * @param {Object} options - iframe 옵션
   * @returns {HTMLIFrameElement}
   */
  static createIframe(videoId, options = {}) {
    const {
      width = "100%",
      height = "100%",
      autoplay = 0,
      controls = 1,
      className = "",
      id = "",
    } = options;

    const iframe = document.createElement("iframe");
    iframe.width = width;
    iframe.height = height;
    iframe.src = this.getYouTubeUrl(videoId, { autoplay, controls });
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    if (className) iframe.className = className;
    if (id) iframe.id = id;

    return iframe;
  }

  /**
   * 비디오 재생
   * @param {HTMLIFrameElement} iframe - iframe 요소
   */
  static play(iframe) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
  }

  /**
   * 비디오 일시정지
   * @param {HTMLIFrameElement} iframe - iframe 요소
   */
  static pause(iframe) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }

  /**
   * 비디오 정지
   * @param {HTMLIFrameElement} iframe - iframe 요소
   */
  static stop(iframe) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      '{"event":"command","func":"stopVideo","args":""}',
      "*"
    );
  }

  /**
   * 비디오 시간 이동
   * @param {HTMLIFrameElement} iframe - iframe 요소
   * @param {number} seconds - 이동할 시간 (초)
   */
  static seekTo(iframe, seconds) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      `{"event":"command","func":"seekTo","args":[${seconds}, true]}`,
      "*"
    );
  }

  /**
   * 비디오 볼륨 설정
   * @param {HTMLIFrameElement} iframe - iframe 요소
   * @param {number} volume - 볼륨 (0-100)
   */
  static setVolume(iframe, volume) {
    if (!iframe || !iframe.contentWindow) return;
    const vol = Math.max(0, Math.min(100, volume));
    iframe.contentWindow.postMessage(
      `{"event":"command","func":"setVolume","args":[${vol}]}`,
      "*"
    );
  }

  /**
   * 비디오 음소거 토글
   * @param {HTMLIFrameElement} iframe - iframe 요소
   * @param {boolean} mute - 음소거 여부
   */
  static toggleMute(iframe, mute) {
    if (!iframe || !iframe.contentWindow) return;
    const func = mute ? "mute" : "unMute";
    iframe.contentWindow.postMessage(
      `{"event":"command","func":"${func}","args":""}`,
      "*"
    );
  }
}

/**
 * 비디오 데이터 모델
 */
class VideoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.url = data.url || "";
    this.title = data.title || "";
    this.category = data.category || "";
    this.subcate = data.subcate || "";
    this.keywords = data.keywords || [];
    this.bookmark = data.bookmark || false;
    this.completed = data.completed || false;
    this.picker = data.picker || "";
    this.type = data.type || "main";
    this.gauge = data.gauge || 0;
    this.description = data.description || "";
    this.duration = data.duration || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * 비디오 ID 가져오기
   * @returns {string}
   */
  getVideoId() {
    return VideoBase.extractYouTubeId(this.url) || this.url;
  }

  /**
   * 썸네일 URL 가져오기
   * @param {string} quality - 품질
   * @returns {string}
   */
  getThumbnailUrl(quality = "sd") {
    const videoId = this.getVideoId();
    return VideoBase.getYouTubeThumbnail(videoId, quality);
  }

  /**
   * 임베드 URL 가져오기
   * @param {Object} options - 옵션
   * @returns {string}
   */
  getEmbedUrl(options = {}) {
    const videoId = this.getVideoId();
    return VideoBase.getYouTubeUrl(videoId, options);
  }

  /**
   * 북마크 토글
   */
  toggleBookmark() {
    this.bookmark = !this.bookmark;
    this.updatedAt = new Date();
  }

  /**
   * 완료 상태 설정
   * @param {boolean} completed - 완료 여부
   */
  setCompleted(completed) {
    this.completed = completed;
    this.updatedAt = new Date();
  }

  /**
   * JSON으로 변환
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      url: this.url,
      title: this.title,
      category: this.category,
      subcate: this.subcate,
      keywords: this.keywords,
      bookmark: this.bookmark,
      completed: this.completed,
      picker: this.picker,
      type: this.type,
      gauge: this.gauge,
      description: this.description,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

/**
 * 비디오 컬렉션 관리
 */
class VideoCollection {
  constructor(videos = []) {
    this.videos = videos.map((v) => (v instanceof VideoModel ? v : new VideoModel(v)));
  }

  /**
   * 비디오 추가
   * @param {Object|VideoModel} video - 비디오 데이터
   */
  add(video) {
    const model = video instanceof VideoModel ? video : new VideoModel(video);
    this.videos.push(model);
  }

  /**
   * 비디오 제거
   * @param {number|string} id - 비디오 ID
   */
  remove(id) {
    this.videos = this.videos.filter((v) => v.id !== id);
  }

  /**
   * ID로 비디오 찾기
   * @param {number|string} id - 비디오 ID
   * @returns {VideoModel|null}
   */
  findById(id) {
    return this.videos.find((v) => v.id === id) || null;
  }

  /**
   * 필터링
   * @param {Function} predicate - 필터 함수
   * @returns {VideoCollection}
   */
  filter(predicate) {
    return new VideoCollection(this.videos.filter(predicate));
  }

  /**
   * 카테고리로 필터링
   * @param {string} category - 카테고리
   * @returns {VideoCollection}
   */
  filterByCategory(category) {
    return this.filter((v) => v.category === category);
  }

  /**
   * 키워드로 필터링
   * @param {Array} keywords - 키워드 배열
   * @returns {VideoCollection}
   */
  filterByKeywords(keywords) {
    return this.filter((v) => keywords.some((k) => v.keywords.includes(k)));
  }

  /**
   * 북마크된 비디오만
   * @returns {VideoCollection}
   */
  getBookmarked() {
    return this.filter((v) => v.bookmark);
  }

  /**
   * 완료된 비디오만
   * @returns {VideoCollection}
   */
  getCompleted() {
    return this.filter((v) => v.completed);
  }

  /**
   * 미완료 비디오만
   * @returns {VideoCollection}
   */
  getIncomplete() {
    return this.filter((v) => !v.completed);
  }

  /**
   * 정렬
   * @param {Function} compareFn - 비교 함수
   * @returns {VideoCollection}
   */
  sort(compareFn) {
    return new VideoCollection([...this.videos].sort(compareFn));
  }

  /**
   * 개수
   * @returns {number}
   */
  count() {
    return this.videos.length;
  }

  /**
   * 배열로 변환
   * @returns {Array}
   */
  toArray() {
    return this.videos;
  }

  /**
   * JSON으로 변환
   * @returns {Array}
   */
  toJSON() {
    return this.videos.map((v) => v.toJSON());
  }
}

// ES6 모듈 내보내기
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VideoBase, VideoModel, VideoCollection };
}
