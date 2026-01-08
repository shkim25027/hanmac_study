// multiGuide.js
class MultiGuide {
    constructor(targets) {
      this.targets = targets;
      this.isActive = false;
      this.init();
    }
  
    init() {
      console.log("[MultiGuide.init] 초기화 시작");
      
      this.guideWrap = document.querySelector(".guide-wrap");
      console.log("[MultiGuide.init] guideWrap:", this.guideWrap);
      
      if (!this.guideWrap) {
        console.error("[MultiGuide.init] ❌ .guide-wrap 요소를 찾을 수 없습니다!");
        setTimeout(() => {
          this.guideWrap = document.querySelector(".guide-wrap");
          if (this.guideWrap) {
            console.log("[MultiGuide.init] ✅ 재시도 후 guideWrap 찾음");
            this.continueInit();
          } else {
            console.error("[MultiGuide.init] ❌ 재시도 실패");
          }
        }, 100);
        return;
      }
      
      this.continueInit();
    }
    
    continueInit() {
      this.cutoutPath = document.getElementById("guide-cutout-path");
      this.strokePath = document.getElementById("guide-stroke-path");
      this.arcEllipseStrokePath = document.getElementById("guide-arc-ellipse-stroke-path");
      this.arcStrokeMaskPath = document.getElementById("guide-arc-stroke-mask-path");
      this.connectionLinesGroup = document.getElementById("guide-connection-lines");
      this.elementConnectionLinesGroup = document.getElementById("guide-element-connection-lines");
      
      this.bordersContainer = document.getElementById("guideBorders");
      this.labelsContainer = document.getElementById("guideLabels");
  
      if (!this.bordersContainer) {
        this.bordersContainer = document.createElement("div");
        this.bordersContainer.id = "guideBorders";
        this.bordersContainer.className = "guide-borders";
        this.guideWrap.appendChild(this.bordersContainer);
      }
  
      if (!this.labelsContainer) {
        this.labelsContainer = document.createElement("div");
        this.labelsContainer.id = "guideLabels";
        this.labelsContainer.className = "guide-labels";
        this.labelsContainer.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10000;";
        this.guideWrap.appendChild(this.labelsContainer);
      }
  
      this.attachEvents();
      console.log("[MultiGuide.init] ✅ 초기화 완료");
    }
  
    getStartButton() {
      return (
        document.querySelector(".guide-start-btn") ||
        document.getElementById("guideStart") ||
        document.querySelector("[data-guide-start]")
      );
    }
  
    attachEvents() {
      const startBtn = this.getStartButton();
      if (startBtn) {
        startBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.show();
        });
      }

      const svg = document.querySelector(".guide-svg");
      if (svg) {
        svg.addEventListener("click", (e) => {
          if (e.target === svg || e.target.tagName.toLowerCase() === "rect") {
            this.hide();
          }
        });
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isActive) {
          this.hide();
        }
      });

      // 화면 리사이즈 시 재측정
      let resizeTimer;
      window.addEventListener("resize", () => {
        if (!this.isActive) return;
        
        // 디바운싱: 100ms 후에 재측정
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          console.log("[MultiGuide] 화면 리사이즈 감지 - 재측정 중...");
          this.createCutouts();
          this.createBorders();
          this.createLabels();
        }, 100);
      });
    }
  
    show() {
        console.log("[MultiGuide.show] 가이드 표시 시작");
        
        if (!this.guideWrap) {
          console.error("[MultiGuide.show] ❌ guideWrap을 찾을 수 없습니다!");
          return;
        }
      
        this.isActive = true;
        this.guideWrap.classList.add("active");
      
        const startBtn = this.getStartButton();
        if (startBtn) startBtn.style.display = "none";
      
        document.body.style.overflow = "hidden";
      
        this.createCutouts();
        this.createBorders();
        this.createLabels();
        
        // 🔥 createLabels 이후에 키워드 연결선 생성
        setTimeout(() => {
          this.createKeywordElementConnection();
        }, 100);
        
        console.log("[MultiGuide.show] ✅ 가이드 표시 완료");
      }
  
    hide() {
      this.isActive = false;
      this.guideWrap.classList.remove("active");
  
      const startBtn = this.getStartButton();
      if (startBtn) startBtn.style.display = "block";
  
      document.body.style.overflow = "";
  
      if (this.bordersContainer) this.bordersContainer.innerHTML = "";
      if (this.labelsContainer) this.labelsContainer.innerHTML = "";
      if (this.connectionLinesGroup) this.connectionLinesGroup.innerHTML = "";
      if (this.elementConnectionLinesGroup) this.elementConnectionLinesGroup.innerHTML = "";
    }
  
    createCutouts() {
        let pathData = "";
        let strokePathData = "";
        let arcEllipseStrokePathData = "";
        let arcStrokeMaskPathData = "";
      
        this.targets.forEach((target) => {
          const element = document.querySelector(target.selector);
          if (!element) {
            console.warn("요소를 찾을 수 없음:", target.selector);
            return;
          }
      
          console.log("[createCutouts]", {
            selector: target.selector,
            useGaugeArc: target.useGaugeArc,
            shape: target.shape
          });
      
          // 🔥 gauge arc 처리
          if (target.useGaugeArc) {
            console.log("[createCutouts] 게이지 아크 생성 중...");
            
            const maskPath = this.createGaugeArcStrokeMaskPath(element, target);
            console.log("[createCutouts] maskPath 길이:", maskPath.length);
            arcStrokeMaskPathData += maskPath + " ";
            
            const strokePath = this.createGaugeArcEllipseStrokeBoundaryPath(element, target);
            console.log("[createCutouts] strokePath 길이:", strokePath.length);
            arcEllipseStrokePathData += strokePath + " ";
          } 
          // 🔥 기본 사각형 처리
          else {
            const rect = element.getBoundingClientRect();
            const padding = target.padding || 0;
            const radius = target.borderRadius || 8;
            
            pathData += this.createRoundedRectPath(
              rect.left - padding,
              rect.top - padding,
              rect.width + padding * 2,
              rect.height + padding * 2,
              radius
            ) + " ";
            
            strokePathData += this.createRoundedRectStrokePath(
              rect.left - padding,
              rect.top - padding,
              rect.width + padding * 2,
              rect.height + padding * 2,
              radius
            ) + " ";
          }
        });
      
        this.cutoutPath.setAttribute("d", pathData.trim());
        
        if (this.strokePath) {
          this.strokePath.setAttribute("d", strokePathData.trim());
        }
        
        if (this.arcStrokeMaskPath) {
          console.log("[createCutouts] arcStrokeMaskPath 설정:", arcStrokeMaskPathData.trim() ? "있음" : "없음");
          this.arcStrokeMaskPath.setAttribute("d", arcStrokeMaskPathData.trim());
        }
        
        if (this.arcEllipseStrokePath) {
          console.log("[createCutouts] arcEllipseStrokePath 설정:", arcEllipseStrokePathData.trim() ? "있음" : "없음");
          this.arcEllipseStrokePath.setAttribute("d", arcEllipseStrokePathData.trim());
        }
      }

    createGaugeArcStrokeMaskPath(containerElement, target) {
      const gaugeSvg = document.getElementById("gauge");
      if (!gaugeSvg) {
        console.warn("gauge SVG를 찾을 수 없습니다");
        return "";
      }
  
      const size = target.gaugeSize || 832;
      const strokeWidth = target.gaugeStrokeWidth || 31;
      const padding = target.gaugePadding || 20;
  
      const center = size / 2;
      const radius = size / 2 - strokeWidth / 2 - padding;
  
      const svgRect = gaugeSvg.getBoundingClientRect();
      const viewBox = gaugeSvg.viewBox.baseVal;
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;
  
      const screenCenterX = svgRect.left + (center - viewBox.x) * scaleX;
      const screenCenterY = svgRect.top + (center - viewBox.y) * scaleY;
      const screenRadius = radius * scaleX;
      const screenStrokeWidth = strokeWidth * scaleX;
  
      const startAngle = target.startAngle || 180;
      const endAngle = target.endAngle || 360;
  
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
  
      const outerRadius = screenRadius + screenStrokeWidth / 2;
      const innerRadius = screenRadius - screenStrokeWidth / 2;
  
      const outerStartX = screenCenterX + outerRadius * Math.cos(startRad);
      const outerStartY = screenCenterY + outerRadius * Math.sin(startRad);
      const outerEndX = screenCenterX + outerRadius * Math.cos(endRad);
      const outerEndY = screenCenterY + outerRadius * Math.sin(endRad);
  
      const innerStartX = screenCenterX + innerRadius * Math.cos(startRad);
      const innerStartY = screenCenterY + innerRadius * Math.sin(startRad);
      const innerEndX = screenCenterX + innerRadius * Math.cos(endRad);
      const innerEndY = screenCenterY + innerRadius * Math.sin(endRad);
  
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  
      let pathData = `
        M ${outerStartX},${outerStartY}
        A ${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEndX},${outerEndY}
        L ${innerEndX},${innerEndY}
        A ${innerRadius},${innerRadius} 0 ${largeArc} 0 ${innerStartX},${innerStartY}
        Z
      `;
  
      const startCapCenterX = screenCenterX + screenRadius * Math.cos(startRad);
      const startCapCenterY = screenCenterY + screenRadius * Math.sin(startRad);
      const capRadius = screenStrokeWidth / 2;
      
      pathData += `
        M ${startCapCenterX + capRadius},${startCapCenterY}
        A ${capRadius},${capRadius} 0 1 1 ${startCapCenterX - capRadius},${startCapCenterY}
        A ${capRadius},${capRadius} 0 1 1 ${startCapCenterX + capRadius},${startCapCenterY}
        Z
      `;
  
      const endCapCenterX = screenCenterX + screenRadius * Math.cos(endRad);
      const endCapCenterY = screenCenterY + screenRadius * Math.sin(endRad);
      
      pathData += `
        M ${endCapCenterX + capRadius},${endCapCenterY}
        A ${capRadius},${capRadius} 0 1 1 ${endCapCenterX - capRadius},${endCapCenterY}
        A ${capRadius},${capRadius} 0 1 1 ${endCapCenterX + capRadius},${endCapCenterY}
        Z
      `;
  
      return pathData;
    }
  
    createGaugeArcEllipseStrokeBoundaryPath(containerElement, target) {
      const gaugeSvg = document.getElementById("gauge");
      if (!gaugeSvg) {
        console.warn("gauge SVG를 찾을 수 없습니다");
        return "";
      }
  
      const size = target.gaugeSize || 832;
      const strokeWidth = target.gaugeStrokeWidth || 31;
      const padding = target.gaugePadding || 20;
  
      const center = size / 2;
      const radius = size / 2 - strokeWidth / 2 - padding;
  
      const svgRect = gaugeSvg.getBoundingClientRect();
      const viewBox = gaugeSvg.viewBox.baseVal;
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;
  
      const screenCenterX = svgRect.left + (center - viewBox.x) * scaleX;
      const screenCenterY = svgRect.top + (center - viewBox.y) * scaleY;
      const screenRadius = radius * scaleX;
      const screenStrokeWidth = strokeWidth * scaleX;
  
      const startAngle = target.startAngle || 180;
      const endAngle = target.endAngle || 360;
  
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
  
      const outerRadius = screenRadius + screenStrokeWidth / 2;
      const innerRadius = screenRadius - screenStrokeWidth / 2;
  
      const outerStartX = screenCenterX + outerRadius * Math.cos(startRad);
      const outerStartY = screenCenterY + outerRadius * Math.sin(startRad);
      const outerEndX = screenCenterX + outerRadius * Math.cos(endRad);
      const outerEndY = screenCenterY + outerRadius * Math.sin(endRad);
  
      const innerStartX = screenCenterX + innerRadius * Math.cos(startRad);
      const innerStartY = screenCenterY + innerRadius * Math.sin(startRad);
      const innerEndX = screenCenterX + innerRadius * Math.cos(endRad);
      const innerEndY = screenCenterY + innerRadius * Math.sin(endRad);
  
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      const capRadius = screenStrokeWidth / 2;
  
      const startCapCenterX = screenCenterX + screenRadius * Math.cos(startRad);
      const startCapCenterY = screenCenterY + screenRadius * Math.sin(startRad);
      const endCapCenterX = screenCenterX + screenRadius * Math.cos(endRad);
      const endCapCenterY = screenCenterY + screenRadius * Math.sin(endRad);
      
      let pathData = "";
      
      pathData += `M ${outerStartX},${outerStartY} A ${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEndX},${outerEndY} `;
      pathData += `M ${innerStartX},${innerStartY} A ${innerRadius},${innerRadius} 0 ${largeArc} 1 ${innerEndX},${innerEndY} `;
      
      const startCapLeftX = startCapCenterX - capRadius;
      const startCapRightX = startCapCenterX + capRadius;
      pathData += `M ${startCapLeftX},${startCapCenterY} A ${capRadius},${capRadius} 0 0 0 ${startCapRightX},${startCapCenterY} `;
      
      const endCapLeftX = endCapCenterX - capRadius;
      const endCapRightX = endCapCenterX + capRadius;
      pathData += `M ${endCapLeftX},${endCapCenterY} A ${capRadius},${capRadius} 0 0 0 ${endCapRightX},${endCapCenterY}`;
  
      return pathData.trim();
    }
  
    createRoundedRectPath(x, y, width, height, radius) {
      return `
        M ${x + radius},${y}
        L ${x + width - radius},${y}
        Q ${x + width},${y} ${x + width},${y + radius}
        L ${x + width},${y + height - radius}
        Q ${x + width},${y + height} ${x + width - radius},${y + height}
        L ${x + radius},${y + height}
        Q ${x},${y + height} ${x},${y + height - radius}
        L ${x},${y + radius}
        Q ${x},${y} ${x + radius},${y}
        Z
      `;
    }
  
    createRoundedRectStrokePath(x, y, width, height, radius) {
      return `
        M ${x + radius},${y}
        L ${x + width - radius},${y}
        Q ${x + width},${y} ${x + width},${y + radius}
        L ${x + width},${y + height - radius}
        Q ${x + width},${y + height} ${x + width - radius},${y + height}
        L ${x + radius},${y + height}
        Q ${x},${y + height} ${x},${y + height - radius}
        L ${x},${y + radius}
        Q ${x},${y} ${x + radius},${y}
        Z
      `;
    }
  
    createBorders() {
      this.targets.forEach((target, index) => {
        const element = document.querySelector(target.selector);
        if (!element) return;
  
        if (target.useGaugeArc || target.shape === "arc") {
          return;
        }
  
        const rect = element.getBoundingClientRect();
        const padding = target.padding || 15;
  
        const border = document.createElement("div");
        border.className = "guide-border";
        border.style.cssText = `
          left: ${rect.left - padding}px;
          top: ${rect.top - padding}px;
          width: ${rect.width + padding * 2}px;
          height: ${rect.height + padding * 2}px;
          animation-delay: ${index * 0.1}s;
        `;
        this.bordersContainer.appendChild(border);
      });
    }
  
    createConnectionLine(elementRect, maskRect, tooltipBox, target, horizontalPos, verticalPos) {
      if (!this.connectionLinesGroup) return;

      // tooltip의 실제 위치 계산
      const tooltipRect = tooltipBox.getBoundingClientRect();
      const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
      const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;

      // 요소의 연결점 계산 (요소의 가장 가까운 모서리 또는 중앙)
      let elementX, elementY;

      if (horizontalPos === "left") {
        // tooltip이 왼쪽에 있으면 요소의 왼쪽 중앙
        elementX = elementRect.left;
        elementY = elementRect.top + elementRect.height / 2;
      } else if (horizontalPos === "right") {
        // tooltip이 오른쪽에 있으면 요소의 오른쪽 중앙
        elementX = elementRect.right;
        elementY = elementRect.top + elementRect.height / 2;
      } else {
        // center일 때
        if (verticalPos === "top") {
          // tooltip이 위에 있으면 요소의 위쪽 중앙
          elementX = elementRect.left + elementRect.width / 2;
          elementY = elementRect.top;
        } else if (verticalPos === "bottom") {
          // tooltip이 아래에 있으면 요소의 아래쪽 중앙
          elementX = elementRect.left + elementRect.width / 2;
          elementY = elementRect.bottom;
        } else {
          // center center일 때는 요소의 중앙
          elementX = elementRect.left + elementRect.width / 2;
          elementY = elementRect.top + elementRect.height / 2;
        }
      }

      // tooltip의 연결점 계산
      let tooltipX, tooltipY;

      if (horizontalPos === "left") {
        // tooltip이 왼쪽에 있으면 tooltip의 오른쪽 중앙
        tooltipX = tooltipRect.right;
        tooltipY = tooltipRect.top + tooltipRect.height / 2;
      } else if (horizontalPos === "right") {
        // tooltip이 오른쪽에 있으면 tooltip의 왼쪽 중앙
        tooltipX = tooltipRect.left;
        tooltipY = tooltipRect.top + tooltipRect.height / 2;
      } else {
        // center일 때
        if (verticalPos === "top") {
          // tooltip이 위에 있으면 tooltip의 아래쪽 중앙
          tooltipX = tooltipRect.left + tooltipRect.width / 2;
          tooltipY = tooltipRect.bottom;
        } else if (verticalPos === "bottom") {
          // tooltip이 아래에 있으면 tooltip의 위쪽 중앙
          tooltipX = tooltipRect.left + tooltipRect.width / 2;
          tooltipY = tooltipRect.top;
        } else {
          // center center일 때는 tooltip의 중앙
          tooltipX = tooltipRect.left + tooltipRect.width / 2;
          tooltipY = tooltipRect.top + tooltipRect.height / 2;
        }
      }

      // SVG path 생성 (부드러운 곡선)
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midX = (elementX + tooltipX) / 2;
      const midY = (elementY + tooltipY) / 2;
      
      // 곡선을 위한 제어점 계산
      let controlX1, controlY1, controlX2, controlY2;
      
      if (horizontalPos === "left" || horizontalPos === "right") {
        // 수평 연결: 수직 방향으로 곡선
        controlX1 = elementX + (tooltipX - elementX) * 0.3;
        controlY1 = elementY;
        controlX2 = tooltipX - (tooltipX - elementX) * 0.3;
        controlY2 = tooltipY;
      } else {
        // 수직 연결: 수평 방향으로 곡선
        controlX1 = elementX;
        controlY1 = elementY + (tooltipY - elementY) * 0.3;
        controlX2 = tooltipX;
        controlY2 = tooltipY - (tooltipY - elementY) * 0.3;
      }

      const pathData = `M ${elementX} ${elementY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${tooltipX} ${tooltipY}`;
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", "#FFF");
      path.setAttribute("stroke-width", "1");
      //path.setAttribute("stroke-dasharray", "2,2");
      path.setAttribute("fill", "none");
      //path.setAttribute("opacity", "0.6");
      path.setAttribute("data-guide-selector", target.selector);

      this.connectionLinesGroup.appendChild(path);
    }

    createKeywordElementConnection() {
        console.log("[createKeywordElementConnection] 시작");
        
        if (!this.elementConnectionLinesGroup) {
          console.warn("❌ elementConnectionLinesGroup 없음");
          return;
        }
      
        const element1 = document.querySelector(".video-card:nth-child(3) .key-badge:first-child");
        const element2 = document.querySelector(".video-card:nth-child(5) .key-badge:first-child");
      
        console.log("element1:", element1);
        console.log("element2:", element2);
      
        if (!element1 || !element2) {
          console.warn("❌ 키워드 요소 없음");
          return;
        }
      
        // 🔥 interest 툴팁의 index 찾기
        const interestTarget = this.targets.find(t => t.class === "interest");
        const interestIndex = this.targets.indexOf(interestTarget);
        const animationDelay = interestIndex >= 0 ? interestIndex * 0.1 + 0.3 : 0.3;
      
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
      
        const x1 = rect1.right;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top;
      
        const offset = 20;
        const midX1 = x1 + offset;
        const midY1 = y1;
        const midX2 = x2;
        const midY2 = y1;
      
        // 두 키워드 요소를 연결하는 실선
        const elementPathData = `M ${x1} ${y1} L ${midX1} ${midY1} L ${midX2} ${midY2} L ${x2} ${y2}`;
        const elementPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        elementPath.setAttribute("d", elementPathData);
        elementPath.setAttribute("stroke", "#FFF");
        elementPath.setAttribute("stroke-width", "1.5");
        elementPath.setAttribute("fill", "none");
        elementPath.setAttribute("stroke-linecap", "round");
        elementPath.setAttribute("stroke-linejoin", "round");
        // 🔥 애니메이션 추가
        elementPath.style.opacity = "0";
        elementPath.style.animation = `connectionFadeIn 0.4s ease-out ${animationDelay}s forwards`;
        
        this.elementConnectionLinesGroup.appendChild(elementPath);
        console.log("✅ 키워드 요소 연결선 추가");
      
        // interest 툴팁박스에서 연결선까지 실선으로 연결
        const interestTooltip = this.labelsContainer.querySelector('.guide-tooltip-box.interest');
        console.log("interestTooltip:", interestTooltip);
        
        if (interestTooltip) {
          const interestRect = interestTooltip.getBoundingClientRect();
          
          const connectionMidX = midX2;
          const connectionMidY = (midY2 + y2) / 2;
          
          const interestX = interestRect.right;
          const interestY = interestRect.top + interestRect.height / 2;
          
          const interestPathData = `M ${interestX} ${interestY} L ${connectionMidX} ${interestY}`;
          
          const interestPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          interestPath.setAttribute("d", interestPathData);
          interestPath.setAttribute("stroke", "#FFF");
          interestPath.setAttribute("stroke-width", "1.5");
          interestPath.setAttribute("fill", "none");
          interestPath.setAttribute("stroke-linecap", "round");
          interestPath.setAttribute("stroke-linejoin", "round");
          // 🔥 애니메이션 추가
          interestPath.style.opacity = "0";
          interestPath.style.animation = `connectionFadeIn 0.4s ease-out ${animationDelay}s forwards`;
          
          this.elementConnectionLinesGroup.appendChild(interestPath);
          console.log("✅ interest 툴팁 연결선 추가");
        } else {
          console.warn("⚠️ interest 툴팁 없음");
        }
      
        // 🔥 애니메이션 CSS 추가
        if (!document.getElementById("guide-connection-animation-styles")) {
          const style = document.createElement("style");
          style.id = "guide-connection-animation-styles";
          style.textContent = `
            @keyframes connectionFadeIn {
              from {
                opacity: 0;
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
              }
              to {
                opacity: 0.8;
                stroke-dasharray: 1000;
                stroke-dashoffset: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
      }

    createLabels() {
      this.targets.forEach((target, index) => {
        if (!target.label) return;

        const element = document.querySelector(target.selector);
        if (!element) return;

        const elementRect = element.getBoundingClientRect();
        // 마스크된 영역의 rect 계산 (padding 포함)
        const padding = target.padding || 0;
        const maskRect = {
          left: elementRect.left - padding,
          top: elementRect.top - padding,
          right: elementRect.right + padding,
          bottom: elementRect.bottom + padding,
          width: elementRect.width + padding * 2,
          height: elementRect.height + padding * 2,
          centerX: elementRect.left + elementRect.width / 2,
          centerY: elementRect.top + elementRect.height / 2
        };

        // 기존 tooltipBox가 있는지 확인 (data-selector 속성으로 찾기)
        let tooltipBox = this.labelsContainer.querySelector(
          `[data-guide-selector="${CSS.escape(target.selector)}"]`
        );

        // 기존 것이 없으면 새로 생성
        if (!tooltipBox) {
          tooltipBox = document.createElement("div");
          // 기본 클래스와 target의 class 속성 추가
          tooltipBox.className = "guide-tooltip-box" + (target.class ? ` ${target.class}` : "");
          tooltipBox.setAttribute("data-guide-selector", target.selector);
          tooltipBox.style.cssText = `
            animation: tooltipFadeIn 0.4s ease-out ${index * 0.1 + 0.3}s forwards;
            opacity: 0;
          `;

          const title = document.createElement("div");
          title.className = "guide-tooltip-title";
          title.textContent = target.label;
          tooltipBox.appendChild(title);

          if (target.description) {
            const description = document.createElement("div");
            description.className = "guide-tooltip-description";
            const lines = target.description.split('\n');
            lines.forEach((line) => {
              if (line.trim()) {
                const p = document.createElement("p");
                p.textContent = line;
                description.appendChild(p);
              }
            });
            tooltipBox.appendChild(description);
          }

          this.labelsContainer.appendChild(tooltipBox);
        }
        
        // 위치 계산 및 업데이트 (기존 것이든 새 것이든 위치는 업데이트)
        // position 형식: "bottom", "top", "left", "right", "center", "center center", "center bottom" 등
        const positionParts = (target.position || "").toLowerCase().split(/\s+/);
        const verticalPos = positionParts.find(p => p === "top" || p === "bottom" || p === "center") || 
                           (elementRect.top < 150 ? "bottom" : "top");
        const horizontalPos = positionParts.find(p => p === "left" || p === "right" || p === "center") || "center";

        let left, top;

        // 가로 위치 계산
        if (horizontalPos === "left") {
          left = maskRect.left - 10;
          tooltipBox.setAttribute("data-position", "left");
          tooltipBox.style.transform = "translateX(-100%)";
        } else if (horizontalPos === "right") {
          left = maskRect.right + 10;
          tooltipBox.setAttribute("data-position", "right");
          tooltipBox.style.transform = "translateX(0)";
        } else {
          // center: position이 "center" 또는 "center center"일 때는 요소의 중앙, 그 외는 마스크된 영역의 중앙
          if (verticalPos === "center" || (positionParts.length === 1 && positionParts[0] === "center")) {
            // 요소의 중앙에 tooltip 중앙이 맞도록
            left = elementRect.left + elementRect.width / 2;
          } else {
            // 마스크된 영역의 중앙에 tooltip 중앙이 맞도록
            left = maskRect.centerX;
          }
          tooltipBox.setAttribute("data-position", "center");
          tooltipBox.style.transform = "translateX(-50%)";
        }

        // 세로 위치 계산
        // learning 클래스인 경우 guide-arc-ellipse-stroke-path의 top 위치 사용
        if (target.class === "learning" && this.arcEllipseStrokePath) {
          const arcPathRect = this.arcEllipseStrokePath.getBoundingClientRect();
          top = arcPathRect.top;
        } else if (verticalPos === "center") {
          // 요소의 중앙에 tooltip 중앙이 맞도록
          const boxHeight = tooltipBox.offsetHeight || 100;
          top = elementRect.top + elementRect.height / 2 - boxHeight / 2;
        } else if (verticalPos === "bottom" || (elementRect.top < 150 && verticalPos !== "top")) {
          top = maskRect.bottom + 15;
        } else {
          const boxHeight = tooltipBox.offsetHeight || 100;
          top = maskRect.top - boxHeight - 15;
          if (top < 10) {
            top = maskRect.bottom + 15;
          }
        }

        tooltipBox.style.left = `${left}px`;
        tooltipBox.style.top = `${top}px`;

        // 연결 라인 그리기
        this.createConnectionLine(elementRect, maskRect, tooltipBox, target, horizontalPos, verticalPos);
      });
  
      if (!document.getElementById("guide-tooltip-styles")) {
        const style = document.createElement("style");
        style.id = "guide-tooltip-styles";
        style.textContent = `
          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .guide-tooltip-box[data-position="left"] {
            animation-name: tooltipFadeInLeft;
          }
          .guide-tooltip-box[data-position="right"] {
            animation-name: tooltipFadeInRight;
          }
          @keyframes tooltipFadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-100%) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(-100%) translateY(0);
            }
          }
          @keyframes tooltipFadeInRight {
            from {
              opacity: 0;
              transform: translateX(0) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0) translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  // 초기화 함수
  window.initMultiGuide = function(targets) {
    if (window.multiGuide) {
      console.log("MultiGuide가 이미 초기화되어 있습니다.");
      return;
    }
  
    window.multiGuide = new MultiGuide(targets);
    console.log("멀티 가이드 초기화 완료!");
    
    let retryCount = 0;
    const maxRetries = 50;
    
    function autoShowGuide() {
      retryCount++;
      
      const requiredElements = targets.map(target => {
        const el = document.querySelector(target.selector);
        return { target, element: el, found: el !== null };
      });
      
      const foundCount = requiredElements.filter(r => r.found).length;
      
      console.log(`[MultiGuide] 요소 확인 (${retryCount}회차): ${foundCount}/${targets.length}`);
      
      const minRequiredElements = Math.max(3, Math.floor(targets.length * 0.5));
      
      if (foundCount >= minRequiredElements) {
        const gaugeTarget = targets.find(t => t.useGaugeArc);
        if (gaugeTarget) {
          const gaugeElement = document.getElementById("gauge");
          if (gaugeElement) {
            const hasGaugeContent = gaugeElement.children.length > 0 || 
                                   gaugeElement.querySelector('path') !== null ||
                                   gaugeElement.innerHTML.trim() !== '';
            
            if (!hasGaugeContent && retryCount < 20) {
              console.log("[MultiGuide] 게이지가 아직 초기화되지 않았습니다. 대기 중...");
              if (retryCount < maxRetries) {
                setTimeout(autoShowGuide, 200);
              }
              return;
            }
          }
        }
        
        try {
          console.log("[MultiGuide] 가이드 실행 시도...");
          window.multiGuide.show();
          console.log("[MultiGuide] ✅ 멀티 가이드 자동 실행 완료!");
        } catch (error) {
          console.error("[MultiGuide] ❌ 실행 중 오류:", error);
        }
      } else {
        if (retryCount < maxRetries) {
          console.log(`[MultiGuide] 요소가 부족합니다. 재시도 중... (${retryCount}/${maxRetries})`);
          setTimeout(autoShowGuide, 200);
        } else {
          console.warn("[MultiGuide] ⚠️ 자동 실행 시간 초과");
          if (foundCount > 0) {
            try {
              window.multiGuide.show();
            } catch (error) {
              console.error("[MultiGuide] 실행 실패:", error);
            }
          }
        }
      }
    }
  
    if (document.readyState === "complete") {
      setTimeout(autoShowGuide, 100);
    } else {
      window.addEventListener("load", () => {
        setTimeout(autoShowGuide, 100);
      });
    }
  };