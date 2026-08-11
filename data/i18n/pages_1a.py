# -*- coding: utf-8 -*-
"""Batch 1a: how-to-play + modes (ko/es)."""

PAGES = {
# ============ HOW TO PLAY ============
"how-to-play": {
 "ko": {
  "title": "메카 카멜레온 게임 방법",
  "metaTitle": "메카 카멜레온 게임 방법: 초보자 완전 가이드 (2026)",
  "metaDescription": "메카 카멜레온 입문 가이드: 칠해서 숨기 메커니즘, 페인트 시스템, 클론과 포즈, 숨는 역할과 사냥꾼 역할, 라운드 진행.",
  "intro": "메카 카멜레온은 배우기 쉽지만 의외로 깊이가 있습니다. 첫 라운드 전에 알아두면 좋은 모든 것을 정리했습니다.",
  "sections": [
   {"type":"steps","heading":"핵심 루프: 칠해서 숨기","body":"모든 플레이어는 흰색 피규어로 시작합니다. 숨는 역할은 몸을 맵에 맞게 칠해 살아남고, 사냥꾼은 소총으로 이들을 추격합니다. 시간이 끝날 때까지 숨는 역할이 한 명이라도 남아 있으면 숨는 쪽이 승리합니다.","items":[
     "페인트 버튼을 눌러 몸을 맵의 색과 질감으로 덮는다",
     "스포이드로 정확한 색을 채취한다 — 감으로 칠하지 않는다",
     "색뿐 아니라 빛의 방향도 맞춘다, 그렇지 않으면 빛나 보인다",
     "메탈릭과 러프니스를 조절해 표면이 반사되지 않게 한다"]},
   {"type":"table","heading":"숨는 역할 vs 사냥꾼: 역할 심층 분석","body":"어느 쪽을 맡느냐에 따라 승리 방식이 완전히 달라집니다. 게임에서 숨는 역할은 '카멜레온', 사냥꾼은 '시커'라고 부릅니다.","columns":["역할","목표","주요 도구","승리 조건"],"rows":[
     ["숨는 역할 (카멜레온)","시간이 끝날 때까지 살아남기","페인트, 클론, 포즈, 크기 (블로비/큐브)","시간 종료 시 한 명 이상 숨어 있으면 승리"],
     ["사냥꾼 (시커)","모든 숨는 역할을 찾아 태그","소총, 자유 카메라, 조롱 휘파람","시간 내에 모든 숨는 역할 태그"]]},
   {"type":"list","heading":"페인트 시스템","body":"변장 시스템이 이 게임의 핵심입니다. 제대로 칠하면 사라지고, 실수하면 빛나며 들킵니다.","items":[
     "컬러 피커 + 스포이드 (E): 눈대중 대신 표면의 정확한 색을 채취",
     "HSV/메탈릭/러프니스 슬라이더로 마감을 미세 조정해 재질에 맞춘다",
     "빛의 방향을 맞춘다 — 색이 맞아도 빛이 다르면 반사한다",
     "칠한 뒤 '정답 확인'으로 색이 얼마나 가까운지, '놓친 부분 랭킹'으로 가장 어색한 곳을 확인",
     "보이는 몸 전체를 칠한다 — 칠하지 않은 손이나 발이 들통나게 한다",
     "되돌리기 불가: 모든 붓질은 라운드가 끝날 때까지 되돌릴 수 없다 — 빠르되 신중하게, 한 번의 실수로 변장이 망가진다 (Kotaku)"]},
   {"type":"list","heading":"클론, 포즈 & 크기","body":"변장을 강화하는 추가 도구입니다 (클론은 2.0.0 업데이트에서 추가).","items":[
     "클론: 칠하고 포즈를 잡은 뒤 Q를 눌러 미끼 복제본을 배치 — 동시에 최대 2개",
     "클론이 파괴되면 본체도 노출된다 — 클론은 추가 목숨이 아니다",
     "포즈: 쪼그려 앉기, 앉기, 몸 웅크리기, 눕기 — 특이한 모양에 맞춘다 (숫자 키/포즈 메뉴)",
     "크기: 블로비 또는 큐브 캐릭터 (1.9.0 추가)를 골라 숨을 곳에 맞춘다",
     "도발: 숨는 역할은 휘파람으로 사냥꾼을 유인할 수 있다. 호스트는 일정 시간 후 강제 도발을 설정할 수도 있다"]},
   {"type":"steps","heading":"라운드 진행: 실제 흐름","body":"한 라운드를 단계별로 설명합니다.","items":[
     "카운트다운 — 모두 흰색 피규어로 맵에 스폰",
     "페인트 단계 — 숨는 역할이 색을 채취해 칠한다. 사냥꾼은 이미 움직이고 있을 수 있다",
     "사냥 단계 — 시커가 수색하고 카멜레온은 변장한 채 움직이지 않는다",
     "태그 & 탈락 — 태그된 숨는 역할은 탈락 (인펙션 모드에서는 사냥꾼에 합류)",
     "시간 종료 — 한 명이라도 숨어 있으면 숨는 쪽 승리"]},
   {"type":"list","heading":"첫 단계: 초보자 퀵스타트","body":"이 다섯 가지만 익혀도 대부분의 신규 플레이어보다 잘할 수 있습니다.","items":[
     "빠르게 칠하기: F로 페인트 모드 진입, 드래그로 몸을 덮고, E로 색 채취",
     "항상 스포이드를 사용한다 — 색을 감으로 정하지 않는다",
     "빛 맞추기: 흉내 내는 벽과 같은 방향으로 칠한다",
     "칠한 뒤 움직이지 않는다 — 움직임은 잔상으로 드러난다",
     "양쪽 역할을 모두 해본다 — 사냥꾼을 이해하면 숨는 역할도 잘한다",
     "되돌리기가 없다는 걸 감안하라: 실수한 붓질은 라운드 내내 남으므로 칠하기 전에 색을 확인한다"]},
  ],
 },
 "es": {
  "title": "Cómo jugar a Meccha Chameleon",
  "metaTitle": "Cómo jugar a Meccha Chameleon: guía de inicio (2026)",
  "metaDescription": "¿Nuevo en Meccha Chameleon? Domina pintar para esconderte, el sistema de pintura, clones y poses, los roles de Escondedor y Cazador y el flujo de ronda.",
  "intro": "Meccha Chameleon es fácil de aprender pero sorprendentemente profundo. Esto es todo lo que necesitas saber antes de tu primera ronda.",
  "sections": [
   {"type":"steps","heading":"El bucle principal: pintar para esconderse","body":"Todos los jugadores empiezan como una figura blanca. Los Escondedores sobreviven pintando su cuerpo para igualar el mapa, mientras los Cazadores los persiguen con un rifle. Si al terminar el tiempo queda al menos un Escondedor oculto, gana el equipo de los Escondedores.","items":[
     "Mantén pulsado el botón de pintar para cubrir tu cuerpo con los colores y texturas del mapa",
     "Usa el cuentagotas para muestrear un color exacto: nunca lo adivines",
     "Iguala la dirección de la luz, no solo el color, o brillarás",
     "Ajusta metalizado y rugosidad para que tu superficie no refleje la luz"]},
   {"type":"table","heading":"Escondedor vs Cazador: roles a fondo","body":"Qué bando te toque cambia por completo cómo ganas. En el juego los Escondedores se llaman Camaleones y los Cazadores se llaman Buscadores.","columns":["Rol","Objetivo","Herramientas clave","Condición de victoria"],"rows":[
     ["Escondedor (Camaleón)","Sobrevivir hasta que acabe el tiempo","Pintura, clones, poses, tamaño (bloby/cubo)","Al menos un Escondedor oculto al terminar el tiempo"],
     ["Cazador (Buscador)","Encontrar y marcar a todos","Rifle, cámara libre, silbato de provocación","Marcar a todos antes de que expire el tiempo"]]},
   {"type":"list","heading":"El sistema de pintura","body":"El sistema de disfraz es el corazón del juego. Si lo haces bien desapareces; si fallas, brillas.","items":[
     "Selector de color + cuentagotas (E): muestrea el color exacto de la superficie en vez de igualarlo a ojo",
     "Los deslizadores HSV/metalizado/rugosidad ajustan el acabado para que la pintura iguale el material",
     "Iguala la dirección de la luz: un color perfecto con luz equivocada sigue reflejando",
     "Tras pintar, la 'comprobación de respuesta' te dice qué tan cerca está tu color; el 'ranking de zonas olvidadas' muestra los peores puntos",
     "Pinta todo tu cuerpo visible: una mano o un pie sin pintar te delata",
     "Sin deshacer: cada pincelada es permanente hasta que termina la ronda — pinta rápido pero con cuidado, porque una mala pincelada puede arruinar tu disfraz (Kotaku)"]},
   {"type":"list","heading":"Clones, poses y tamaños","body":"Herramientas extra para vender el disfraz (los clones se añadieron en la actualización 2.0.0).","items":[
     "Clones: pulsa Q tras pintar y posar para soltar una copia señuelo: hasta dos clones activos",
     "Si destruyen un clon, tu cuerpo principal queda expuesto: los clones no son vidas extra",
     "Poses: agacharse, sentarse, encogerse, tumbarse: úsalas para igualar formas raras (teclas numéricas/menú de poses)",
     "Tamaño: elige Bloby o el personaje Cubo (añadido en 1.9.0) para distintos escondites",
     "Provocación: los Escondedores pueden silbar para atraer a los Cazadores; el anfitrión puede forzar provocaciones tras un tiempo"]},
   {"type":"steps","heading":"Flujo de la ronda: qué ocurre realmente","body":"Una ronda completa, paso a paso.","items":[
     "Cuenta atrás: todos aparecen como figuras blancas en el mapa",
     "Fase de pintura: los Escondedores muestrean colores y se pintan; los Cazadores ya pueden moverse",
     "Fase de caza: los Buscadores buscan mientras los Camaleones permanecen quietos en su disfraz",
     "Marca y eliminación: un Escondedor marcado queda fuera (o se une a los Cazadores en modo Infección)",
     "Fin del tiempo: si queda algún Escondedor oculto, gana el equipo de los Escondedores"]},
   {"type":"list","heading":"Primeros pasos: inicio rápido para novatos","body":"Haz estas cinco cosas y jugarás mejor que la mayoría de los nuevos jugadores al instante.","items":[
     "Aprende a pintar rápido: entra en modo pintura (F), arrastra para cubrir tu cuerpo y muestrea con E",
     "Usa siempre el cuentagotas: nunca adivines un color",
     "Iguala la luz: pinta mirando en la misma dirección que la pared que imitas",
     "Quédate quieto tras pintar: el movimiento deja un rastro visible",
     "Juega ambos roles: entender a los Cazadores te hace mejor Escondedor y viceversa",
     "Cuenta con no poder deshacer: una pincelada errónea dura toda la ronda, así que muestrea la superficie antes de comprometerte"]},
  ],
 },
},
# ============ MODES ============
"modes": {
 "ko": {
  "title": "메카 카멜레온 전체 모드 설명",
  "metaTitle": "메카 카멜레온 모드: 전체 4가지 + 승리법 (2026)",
  "metaDescription": "메카 카멜레온의 모든 모드 — 베이직, 인펙션, 더블, 리버스 치킨 레이스 — 규칙과 각 모드 최고의 승리 전략.",
  "intro": "메카 카멜레온에는 플레이 방식을 완전히 바꾸는 여러 모드가 있습니다. 각 모드가 하는 일과 이기는 방법을 소개합니다.",
  "sections": [
   {"type":"table","heading":"게임 모드","body":"현재 버전의 4가지 모드와 승리 조건입니다. 노멀(베이직)은 출시 때부터 있던 모드이고, 리버스 치킨 레이스는 2.4.0 패치(2026년 7월 2일)에서 추가되었습니다.","columns":["모드","진행 방식","승리 전략"],"rows":[
     ["베이직 (노멀)","클래식 숨는 역할 vs 사냥꾼 숨바꼭질","수직면에 녹아들고, 칠한 뒤에는 움직이지 않는다"],
     ["인펙션 (인크리싱 오니)","태그된 숨는 역할이 사냥꾼 팀에 합류","사냥꾼: 쉬운 목표부터 태그해 숫자를 키운다"],
     ["더블","모두 먼저 숨고, 그다음 모두 사냥 — 가장 많이 찾은 사람이 승리","숨는 단계에서 클론과 포즈로 주의를 분산한다"],
     ["리버스 치킨 레이스","각자 몸을 칠하고, 모든 작품을 받침대에 전시. 관찰 시간 후 서로를 사냥","기억에 남는 칠하기를 하고, 다른 플레이어를 본 위치를 기억한다"]]},
   {"type":"list","heading":"모드의 변천 (출시 → 현재)","body":"모드 목록은 출시 후 늘어났습니다. 그래서 오래된 기사는 3가지 모드만 다룹니다.","items":[
     "출시 (2026년 6월 10일): 노멀, 인펙션, 더블 3가지 모드",
     "2.4.0 패치 (2026년 7월 2일): 리버스 치킨 레이스가 4번째 모드로 추가",
     "혼란의 원인: Steam 출시 당시 스토어 문구는 '3가지 대전 모드'라고 했고, 7월 2일 이전에 작성된 공략은 새 모드보다 먼저 쓰인 것" ]},
   {"type":"list","heading":"커스텀 룸","body":"커스텀 룸은 게임 모드가 아니라 서버 옵션입니다 — 호스트가 최대 8명까지 규칙을 조정할 수 있습니다.","items":[
     "라운드 시간을 조정해 빠른 게임으로",
     "비밀번호를 설정해 비공개 세션으로",
     "방에서 사용할 모드를 선택"]},
   {"type":"faq","heading":"모드 FAQ","body":"","items":[
     ["게임에 모드가 3개뿐이라고 하는 기사가 있는 이유는?","출시 당시에는 노멀, 인펙션, 더블 3개였습니다. 2.4.0 패치(2026년 7월 2일)가 리버스 치킨 레이스를 4번째로 추가했기 때문에, 그 이전에 게시된 공략은 3개만 다룹니다."],
     ["초보자는 어떤 모드부터 시작해야 하나요?","베이직(노멀) 모드가 가장 단순합니다 — 추가 규칙 없는 클래식 숨바꼭질. 인펙션이나 더블 전에 몇 라운드 해보세요."],
     ["호스트가 모드와 라운드 시간을 바꿀 수 있나요?","네 — 서버를 만들 때 호스트가 모드를 고르고 라운드 시간을 설정합니다."],
     ["솔로 모드가 있나요?","없습니다 — 메카 카멜레온은 Steam PC에서만 즐기는 온라인 멀티플레이 전용 게임입니다."],
     ["모든 모드가 같은 인원 범위를 지원하나요?","4개 모드 모두 게임의 전체 인원 범위를 지원합니다. 권장 범위는 2-12명입니다 (Steam 스토어 설명은 2-10명)."]]},
  ],
 },
 "es": {
  "title": "Todos los modos de Meccha Chameleon explicados",
  "metaTitle": "Modos de Meccha Chameleon: los 4 + cómo ganar (2026)",
  "metaDescription": "Todos los modos de Meccha Chameleon — Básico, Infección, Doble y Reverse Chicken Race — con reglas y la mejor estrategia para ganar.",
  "intro": "Meccha Chameleon incluye varios modos que cambian por completo la forma de jugar. Esto es lo que hace cada uno y cómo ganar.",
  "sections": [
   {"type":"table","heading":"Modos de juego","body":"Los cuatro modos de la versión actual con sus condiciones de victoria. Básico (Normal) fue el modo de lanzamiento; Reverse Chicken Race se añadió en el parche 2.4.0 (2 de julio de 2026).","columns":["Modo","Cómo funciona","Estrategia ganadora"],"rows":[
     ["Básico (Normal)","Escondite clásico de Escondedor contra Cazador","Fúndete con superficies verticales; quédate quieto una vez pintado"],
     ["Infección (Increasing Oni)","Los Escondedores marcados se unen al equipo de Cazadores","Cazadores: marca primero a los objetivos fáciles para hacer crecer tu equipo"],
     ["Doble","Primero todos se esconden, luego todos cazan: gana quien encuentre a más gente","Escondedores: usa clones y poses para dividir la atención antes de la fase de caza"],
     ["Reverse Chicken Race","Cada jugador se pinta y cada obra se muestra en un pedestal; tras el tiempo de observación, todos se cazan entre sí","Crea un pintado memorable y recuerda dónde viste a los demás"]]},
   {"type":"list","heading":"Cómo creció la lista de modos (lanzamiento → hoy)","body":"La lista de modos cambió después del lanzamiento, por eso los artículos antiguos solo mencionan tres.","items":[
     "En el lanzamiento (10 de junio de 2026): tres modos: Normal, Infección y Doble",
     "Parche 2.4.0 (2 de julio de 2026): añadió Reverse Chicken Race como cuarto modo",
     "Por qué la confusión: el texto de la tienda de Steam del lanzamiento dice 'tres modos de combate' y las guías escritas antes del 2 de julio solo listan tres: simplemente son anteriores al modo nuevo" ]},
   {"type":"list","heading":"Salas personalizadas","body":"Las salas personalizadas son una opción de servidor, no un modo: el anfitrión puede ajustar reglas para hasta 8 jugadores.","items":[
     "Ajusta el tiempo de ronda para partidas más rápidas",
     "Pon una contraseña para sesiones privadas",
     "Elige el modo que usa la sala"]},
   {"type":"faq","heading":"FAQ de modos","body":"","items":[
     ["¿Por qué algunos artículos dicen que el juego solo tiene tres modos?","En el lanzamiento venía con tres: Normal, Infección y Doble. El parche 2.4.0 (2 de julio de 2026) añadió Reverse Chicken Race como cuarto, así que cualquier guía publicada antes de esa fecha solo lista tres."],
     ["¿Con qué modo deberían empezar los principiantes?","El modo Básico (Normal) es el más sencillo: escondite clásico de Escondedor contra Cazador sin reglas extra. Prueba unas rondas antes de Infección o Doble."],
     ["¿El anfitrión puede cambiar el modo y el tiempo de ronda?","Sí: al crear un servidor, el anfitrión elige el modo y fija el tiempo de ronda antes de abrir el lobby."],
     ["¿Hay un modo para un solo jugador?","No: Meccha Chameleon es solo multijugador online, en PC vía Steam."],
     ["¿Todos los modos admiten los mismos jugadores?","Los cuatro modos admiten el rango completo del juego; el rango recomendado es de 2 a 12 (la descripción de Steam dice 2 a 10)."]]},
  ],
 },
},
}
