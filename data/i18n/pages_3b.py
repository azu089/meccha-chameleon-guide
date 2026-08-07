# -*- coding: utf-8 -*-
"""Batch 3b: controls + multiplayer (ko/es)."""

PAGES = {
# ============ CONTROLS ============
"controls": {
 "ko": {
  "title": "메카 카멜레온 조작 (전체 키 목록)",
  "metaTitle": "메카 카멜레온 조작: 전체 키 설명 (2026)",
  "metaDescription": "메카 카멜레온의 모든 조작: 이동, 달리기, 점프/벽 오르기, 페인트 모드, 스포이드, 클론, 포즈, 카메라.",
  "intro": "wikiHow 조작 가이드와 공식 Steam 페이지를 바탕으로 한 메카 카멜레온 전체 키보드 조작입니다.",
  "sections": [
   {"type":"table","heading":"키보드 조작","columns":["동작","키"],"rows":[
     ["이동","WASD"],
     ["달리기","Shift"],
     ["점프 / 벽 오르기","Space"],
     ["벽 내려오기","Ctrl"],
     ["페인트 모드 진입","F"],
     ["스포이드 (색 채취)","E"],
     ["클론 생성 / 제거","Q"],
     ["포즈 (쪼그려 앉기, 앉기, 웅크리기, 눕기)","숫자 키 / 포즈 메뉴"],
     ["카메라 / 자유 시점","마우스 룩 + 오른쪽 마우스 / C"]]},
   {"type":"list","heading":"칠하기 필수","items":[
     "F를 눌러 페인트 모드에 들어간 뒤 몸 위를 드래그",
     "감으로 맞추지 말고 E로 표면의 정확한 색을 채취",
     "메탈릭과 러프니스를 조절해 칠이 표면 마감과 맞게",
     "칠은 빛의 방향을 따라야 한다 — 색이 맞아도 빛이 다르면 반짝인다"]},
   {"type":"faq","heading":"조작 FAQ","body":"","items":[
     ["클론은 어떻게 만들나요?","먼저 자신을 칠하고 포즈를 잡은 뒤 Q를 눌러 똑같은 모습의 클론을 배치합니다."],
     ["키를 바꿀 수 있나요?","키보드 리바인딩은 제한적입니다. Steam 덱에서는 Steam Input으로 재매핑하세요."]]},
  ],
 },
 "es": {
  "title": "Controles de Meccha Chameleon (lista completa de teclas)",
  "metaTitle": "Controles de Meccha Chameleon: todas las teclas (2026)",
  "metaDescription": "Todos los controles de Meccha Chameleon: movimiento, sprint, salto/escalada, modo pintura, cuentagotas, clones, poses y cámara.",
  "intro": "Los controles completos de teclado de Meccha Chameleon, según la guía de controles de wikiHow y la página oficial de Steam.",
  "sections": [
   {"type":"table","heading":"Controles de teclado","columns":["Acción","Tecla"],"rows":[
     ["Moverse","WASD"],
     ["Esprintar","Shift"],
     ["Saltar / escalar paredes","Espacio"],
     ["Bajar (pared)","Ctrl"],
     ["Entrar en modo pintura","F"],
     ["Cuentagotas (muestrear color)","E"],
     ["Crear / borrar clones","Q"],
     ["Poses (agacharse, sentarse, encogerse, tumbarse)","Teclas numéricas / menú de poses"],
     ["Cámara / cámara libre","Movimiento del ratón + botón derecho / C"]]},
   {"type":"list","heading":"Esenciales de pintura","items":[
     "Pulsa F para entrar en modo pintura y arrastra sobre tu cuerpo",
     "Usa E para muestrear el color exacto de una superficie en vez de adivinar",
     "Ajusta metalizado y rugosidad para que la pintura iguale el acabado de la superficie",
     "La pintura sigue la dirección de la luz: un color perfecto con luz equivocada sigue brillando"]},
   {"type":"faq","heading":"FAQ de controles","body":"","items":[
     ["¿Cómo creo un clon?","Píntate y pósate primero, luego pulsa Q para soltar un clon con tu aspecto exacto."],
     ["¿Puedo cambiar las teclas?","La reasignación de teclado es limitada; en Steam Deck usa Steam Input para reasignar."]]},
  ],
 },
},
# ============ MULTIPLAYER ============
"multiplayer": {
 "ko": {
  "title": "메카 카멜레온 멀티플레이: 방장, 참가 & 친구와 플레이",
  "metaTitle": "메카 카멜레온 멀티플레이 가이드 (2026)",
  "metaDescription": "메카 카멜레온 멀티플레이 작동 방식 — 방 만들기, 공개 서버 참가, 친구와 플레이, 인원 수, 서버 안정성.",
  "intro": "메카 카멜레온은 온라인 멀티플레이 게임입니다. 방을 만들고, 참가하고, 친구와 플레이하는 방법입니다.",
  "sections": [
   {"type":"steps","heading":"비공개 룸 만들기","items":[
     "메인 메뉴에서 서버 만들기(Create Server) 선택",
     "서버 이름을 정하고 친구용 비밀번호 설정",
     "게임 모드 선택 및 라운드 시간 설정",
     "서버 이름/비밀번호를 그룹과 공유"]},
   {"type":"list","heading":"공개 서버 참가","items":[
     "메인 메뉴에서 빠른 매칭(Quick Match)을 골라 즉시 게임",
     "서버 브라우저로 이름을 검색해 룸 찾기",
     "서버당 최대 24명, 개발자는 안정성을 위해 2-12명 권장",
     "Steam 상점 설명은 2-10명을 권장하고, Wikipedia는 2-12명을 권장 범위로 꼽습니다"]},
   {"type":"faq","heading":"멀티플레이 FAQ","body":"","items":[
     ["몇 명까지 같이 플레이할 수 있나요?","서버당 최대 24명. 권장 범위는 2-12명입니다."],
     ["크로스플레이인가요?","아니요 — Steam에서 PC 전용입니다. Mac 플레이어는 GeForce NOW 클라우드 스트리밍으로 참여할 수 있습니다."],
     ["Steam에서 친구와 플레이할 수 있나요?","네 — 비공개 룸을 만들고 이름/비밀번호를 공유하거나 Steam 친구 목록을 사용하세요."]]},
  ],
 },
 "es": {
  "title": "Multijugador de Meccha Chameleon: crear, unirse y jugar con amigos",
  "metaTitle": "Guía de multijugador de Meccha Chameleon (2026)",
  "metaDescription": "Cómo funciona el multijugador de Meccha Chameleon: crear sala, unirse a servidores públicos, jugar con amigos, número de jugadores y estabilidad.",
  "intro": "Meccha Chameleon es un juego multijugador online. Así se crea una sala, se une y se juega con amigos.",
  "sections": [
   {"type":"steps","heading":"Crear una sala privada","items":[
     "Desde el menú principal elige Crear servidor",
     "Pon un nombre al servidor y fija una contraseña para los amigos",
     "Elige el modo de juego y fija el tiempo de ronda",
     "Comparte el nombre/contraseña del servidor con tu grupo"]},
   {"type":"list","heading":"Unirse a servidores públicos","items":[
     "Elige Partida rápida en el menú principal para jugar al instante",
     "Usa el navegador de servidores para encontrar una sala por nombre",
     "Hasta 24 jugadores por servidor; los desarrolladores recomiendan 2-12 para estabilidad",
     "La descripción de la tienda de Steam sugiere 2-10 jugadores; Wikipedia lista 2-12 como rango recomendado"]},
   {"type":"faq","heading":"FAQ de multijugador","body":"","items":[
     ["¿Cuántos jugadores pueden jugar juntos?","Hasta 24 por servidor. El rango recomendado es de 2 a 12 jugadores."],
     ["¿Tiene crossplay?","No: solo PC en Steam. Los jugadores de Mac pueden unirse vía la transmisión en la nube de GeForce NOW."],
     ["¿Puedo jugar con amigos de Steam?","Sí: crea una sala privada y comparte el nombre/contraseña, o usa la lista de amigos de Steam."]]},
  ],
 },
},
}
