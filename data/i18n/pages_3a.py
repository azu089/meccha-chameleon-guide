# -*- coding: utf-8 -*-
"""Batch 3a: system-requirements + steam-deck + crossplay (ko/es)."""

PAGES = {
# ============ SYSTEM REQUIREMENTS ============
"system-requirements": {
 "ko": {
  "title": "메카 카멜레온 시스템 요구 사항 & Steam 덱",
  "metaTitle": "메카 카멜레온 시스템 요구 사항 & Steam 덱 (2026)",
  "metaDescription": "메카 카멜레온을 실행할 수 있나요? 최소 시스템 요구 사항, Steam 덱 호환성, GeForce NOW로 Mac에서 플레이하는 방법.",
  "intro": "메카 카멜레온은 가볍게 실행되는 게임입니다. 공식 최소 요구 사항과 다른 하드웨어에서의 실행 방식을 소개합니다.",
  "sections": [
   {"type":"table","heading":"최소 시스템 요구 사항","body":"Steam 상점 페이지의 공식 최소 요구 사항입니다.","columns":["구성","요구 사항"],"rows":[
     ["OS","Windows 10 64-bit"],
     ["프로세서","Intel Core i5"],
     ["그래픽","DirectX 11 또는 12 호환 그래픽 카드"]]},
   {"type":"list","heading":"Steam 덱 & Mac","body":"다른 기기에서 플레이하는 방법입니다.","items":[
     "Steam 덱: 공식 등급 '플레이 가능' — 실행은 되지만, 키보드식 조작(칠하기, 포즈)은 트랙패드나 연결한 마우스로 하는 게 가장 좋습니다",
     "Mac: 네이티브 macOS 버전은 없음 — GeForce NOW 클라우드 스트리밍으로 플레이 (2026년 6월 27일부터 제공)",
     "이 게임은 Steam에서 PC 전용입니다. 네이티브 PS5/Xbox/Switch 버전은 없습니다"]},
   {"type":"faq","heading":"시스템 요구 사항 FAQ","body":"","items":[
     ["메카 카멜레온은 좋은 PC가 필요한가요?","아니요 — 최소 사양이 낮습니다: Windows 10 64-bit, Intel Core i5 프로세서, DirectX 11/12 호환 그래픽 카드면 됩니다. 가벼운 파티 게임입니다."],
     ["Mac에서 되나요?","네이티브 Mac 버전은 없지만, Mac 플레이어는 GeForce NOW로 스트리밍할 수 있습니다."],
     ["인터넷 연결이 필요한가요?","네 — 메카 카멜레온은 온라인 멀티플레이 게임이라 플레이하려면 안정적인 연결이 필요합니다."],
     ["Steam 덱과 호환되나요?","Valve는 '플레이 가능'으로 표시합니다. 설정과 조작 레이아웃은 Steam 덱 가이드를 참고하세요."]]},
  ],
 },
 "es": {
  "title": "Requisitos del sistema de Meccha Chameleon y Steam Deck",
  "metaTitle": "Requisitos de Meccha Chameleon y Steam Deck (2026)",
  "metaDescription": "¿Puedes ejecutar Meccha Chameleon? Requisitos mínimos del sistema, compatibilidad con Steam Deck y cómo jugar en Mac vía GeForce NOW.",
  "intro": "Meccha Chameleon es un juego ligero de ejecutar. Estos son los requisitos mínimos oficiales y cómo corre en otros equipos.",
  "sections": [
   {"type":"table","heading":"Requisitos mínimos del sistema","body":"Requisitos mínimos oficiales de la página de la tienda de Steam.","columns":["Componente","Requisito"],"rows":[
     ["SO","Windows 10 de 64 bits"],
     ["Procesador","Intel Core i5"],
     ["Gráficos","Tarjeta gráfica compatible con DirectX 11 o 12"]]},
   {"type":"list","heading":"Steam Deck y Mac","body":"Cómo jugar en otros dispositivos.","items":[
     "Steam Deck: clasificado oficialmente como 'Jugable': el juego funciona, pero los controles estilo teclado (pintar, posar) funcionan mejor con el panel táctil o un ratón conectado",
     "Mac: no hay versión nativa de macOS: juega mediante la transmisión en la nube de GeForce NOW (disponible desde el 27 de junio de 2026)",
     "El juego es solo para PC en Steam; no hay versiones nativas de PS5, Xbox ni Switch"]},
   {"type":"faq","heading":"FAQ de requisitos del sistema","body":"","items":[
     ["¿Meccha Chameleon necesita un buen PC?","No: el mínimo es modesto: Windows 10 de 64 bits, un procesador Intel Core i5 y una tarjeta compatible con DirectX 11 o 12. Es un juego de fiesta ligero."],
     ["¿Funciona en Mac?","No hay versión nativa de Mac, pero los jugadores de Mac pueden transmitirlo con GeForce NOW."],
     ["¿Necesito conexión a internet?","Sí: Meccha Chameleon es un juego multijugador online, así que se requiere una conexión estable."],
     ["¿Es compatible con Steam Deck?","Valve lo lista como Jugable; consulta nuestra guía de Steam Deck para ajustes y diseños de control."]]},
  ],
 },
},
# ============ STEAM DECK ============
"steam-deck": {
 "ko": {
  "title": "Steam 덱에서 메카 카멜레온: 설정 & 조작",
  "metaTitle": "메카 카멜레온 Steam 덱 가이드 (2026)",
  "metaDescription": "Steam 덱에서 메카 카멜레온 실행 방법 — 공식 호환성, 최적 설정, 칠하기와 포즈를 위한 조작 및 컨트롤러 레이아웃.",
  "intro": "메카 카멜레온은 Steam 덱에서 '플레이 가능'(Verified 아님)으로 표시됩니다. 잘 실행되지만 키보드식 조작은 설정이 필요합니다 — 최고의 환경을 위한 설정법입니다.",
  "sections": [
   {"type":"table","heading":"Steam 덱 호환성","body":"공식 등급과 그 의미입니다 (Steam 상점 페이지 및 gamingonsteam 기준).","columns":["항목","세부"],"rows":[
     ["공식 등급","플레이 가능 (Verified 아님) — 잘 실행되지만 키보드식 조작은 설정 필요"],
     ["최고의 칠하기 입력","트랙패드 또는 연결한 마우스 — 엄지스틱으로 칠하는 것은 조준이 어렵다"],
     ["권장 설정","60 FPS 제한, VSync 끔, 그림자 품질 높음 (gamingonsteam의 덱 리뷰 기준)"]]},
   {"type":"list","heading":"조작 & 레이아웃 팁","body":"게임의 칠하기/포즈 동작은 키보드 중심이라 Steam Input을 설정하세요.","items":[
     "칠하기(F), 포즈, 스포이드를 누르기 쉬운 버튼에 매핑",
     "오른쪽 트랙패드를 마우스로 사용해 정밀한 색 채취",
     "이 게임용 커뮤니티 Steam Input 레이아웃을 SteamInputDB에서 저장",
     "'게임패드 + 마우스' 템플릿에서 시작해 조정"]},
   {"type":"faq","heading":"Steam 덱 FAQ","body":"","items":[
     ["Steam 덱에서 메카 카멜레온을 플레이할 수 있나요?","네 — '플레이 가능' 등급입니다. Steam에서 설치하고 평소처럼 실행하면 됩니다."],
     ["마우스가 필요한가요?","필수는 아니지만, 트랙패드나 마우스가 있으면 칠하기 제어가 훨씬 쉽습니다."],
     ["Windows 전용인가요?","이 게임은 Steam에서 Windows용입니다. 덱의 Proton/SteamOS가 '플레이 가능' 수준으로 실행합니다."]]},
  ],
 },
 "es": {
  "title": "Meccha Chameleon en Steam Deck: ajustes y controles",
  "metaTitle": "Guía de Meccha Chameleon para Steam Deck (2026)",
  "metaDescription": "Cómo corre Meccha Chameleon en Steam Deck: compatibilidad oficial, mejores ajustes, controles y diseños de mando para pintar y posar.",
  "intro": "Meccha Chameleon figura como Jugable (no Verificado) en Steam Deck. Corre bien, pero los controles estilo teclado necesitan configuración: así lo dejas listo para la mejor experiencia.",
  "sections": [
   {"type":"table","heading":"Compatibilidad con Steam Deck","body":"Clasificación oficial y su significado (según la tienda de Steam y gamingonsteam).","columns":["Elemento","Detalle"],"rows":[
     ["Clasificación oficial","Jugable (no Verificado): corre bien, pero los controles estilo teclado necesitan configuración"],
     ["Mejor entrada para pintar","Panel táctil o ratón conectado: pintar con el stick es difícil de apuntar"],
     ["Ajustes recomendados","Límite de 60 FPS, VSync apagado, calidad de sombras Alta (según el análisis de gamingonsteam del Deck)"]]},
   {"type":"list","heading":"Consejos de controles y diseño","body":"Las acciones de pintar/posar del juego están orientadas al teclado, así que configura Steam Input.","items":[
     "Asigna pintar (F), posar y el cuentagotas a botones de fácil acceso",
     "Usa el panel táctil derecho como ratón para muestrear color con precisión",
     "Guarda un diseño de Steam Input de la comunidad desde SteamInputDB para este juego",
     "Empieza desde una plantilla de 'mando con ratón' y ajusta"]},
   {"type":"faq","heading":"FAQ de Steam Deck","body":"","items":[
     ["¿Puedo jugar Meccha Chameleon en Steam Deck?","Sí: tiene clasificación Jugable. Instálalo desde Steam e inícialo normalmente."],
     ["¿Necesito un ratón?","No es obligatorio, pero el panel táctil o un ratón hace mucho más fácil controlar la pintura."],
     ["¿Es solo para Windows?","El juego es para Windows en Steam; el Proton/SteamOS del Deck lo ejecuta a nivel Jugable."]]},
  ],
 },
},
# ============ CROSSPLAY ============
"crossplay": {
 "ko": {
  "title": "메카 카멜레온 크로스플레이 & 플랫폼 (PC, Mac, 콘솔)",
  "metaTitle": "메카 카멜레온 크로스플레이인가요? 플랫폼 설명 (2026)",
  "metaDescription": "메카 카멜레온은 크로스플랫폼인가요? Steam PC 전용이며 GeForce NOW로 Mac 플레이 가능. 콘솔 버전은 없습니다.",
  "intro": "게임 공식 페이지와 Wikipedia를 바탕으로 한 메카 카멜레온 플랫폼과 크로스플레이에 대한 정확한 답변입니다.",
  "sections": [
   {"type":"faq","heading":"플랫폼 FAQ","body":"","items":[
     ["메카 카멜레온은 크로스플레이인가요?","아니요 — 게임이 Steam에서 PC 전용이므로 크로스플레이가 없습니다. 크로스플레이할 콘솔/모바일 버전도 없습니다."],
     ["Mac에서 플레이할 수 있나요?","네, 간접적으로요: GeForce NOW를 통해 macOS로 스트리밍됩니다 (2026년 6월 27일부터 제공). 네이티브 macOS 버전은 없습니다."],
     ["PS5/Xbox/Switch에 있나요?","없습니다. 개발자는 콘솔 이식을 발표하지 않았습니다. Wikipedia도 유일한 플랫폼으로 Windows를 꼽습니다."],
     ["모바일로 플레이할 수 있나요?","공식적으로는 아닙니다 — iOS/Android 버전이 없습니다. 호환 기기에서 클라우드 스트리밍으로만 가능합니다."],
     ["콘솔로 나올까요?","2026년 8월 기준 콘솔 버전 발표는 없습니다."],
     ["GeForce NOW 플레이어는 Steam 플레이어와 같이 플레이할 수 있나요?","네 — GeForce NOW가 동일한 PC 버전을 스트리밍하므로 모두 같은 Steam 서버에서 플레이합니다."]]},
   {"type":"list","heading":"플레이어들이 함께 플레이하는 방식","body":"PC용 멀티플레이 세부 사항입니다.","items":[
     "Steam PC 플레이어는 공개 서버나 비공개 룸으로 함께 플레이합니다 (최대 24명, 권장 2-12명)",
     "GeForce NOW로 Mac 플레이어도 같은 Steam 서버에 참여할 수 있습니다",
     "별도의 크로스플레이 토글은 없습니다 — 게임 전체가 Steam 안에 있습니다"]},
  ],
 },
 "es": {
  "title": "Crossplay y plataformas de Meccha Chameleon (PC, Mac, consolas)",
  "metaTitle": "¿Meccha Chameleon tiene crossplay? Plataformas (2026)",
  "metaDescription": "¿Es Meccha Chameleon multiplataforma? Es solo para PC en Steam. Juega en Mac vía GeForce NOW. No hay versión de PS5, Xbox ni Switch: explicado.",
  "intro": "La respuesta directa sobre las plataformas y el crossplay de Meccha Chameleon, según la página oficial del juego y Wikipedia.",
  "sections": [
   {"type":"faq","heading":"FAQ de plataformas","body":"","items":[
     ["¿Tiene Meccha Chameleon crossplay?","No: no hay crossplay porque el juego es solo para PC en Steam. No hay versiones de consola ni móvil con las que cruzar."],
     ["¿Puedo jugar en Mac?","Sí, indirectamente: el juego se transmite a macOS mediante GeForce NOW (disponible desde el 27 de junio de 2026). No hay versión nativa de macOS."],
     ["¿Está en PS5, Xbox o Switch?","No. El desarrollador no ha anunciado ports de consola. Wikipedia lista Windows como la única plataforma."],
     ["¿Puedo jugar en el móvil?","Oficialmente no: no existe versión de iOS ni Android. Solo mediante transmisión en la nube en dispositivos compatibles."],
     ["¿Saldrá en consolas?","A agosto de 2026 no se ha anunciado ninguna versión de consola."],
     ["¿Los jugadores de GeForce NOW juegan con los de Steam?","Sí: GeForce NOW transmite la misma versión de PC, así que todos juegan en los mismos servidores de Steam."]]},
   {"type":"list","heading":"Cómo juegan juntos los jugadores","body":"Detalles del multijugador en PC.","items":[
     "Los jugadores de Steam en PC juegan juntos mediante servidores públicos o salas privadas (hasta 24 jugadores, se recomiendan 2-12)",
     "GeForce NOW permite que los jugadores de Mac se unan a los mismos servidores de Steam",
     "No hay un botón de crossplay aparte: todo el juego vive en Steam"]},
  ],
 },
},
}
