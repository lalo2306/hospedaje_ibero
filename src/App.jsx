import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN SYSTEM IBERO (oficial ix Agency 2024) ──────────────────────────
const DS = {
  // Rojo Ibero primary scale
  red900:"#2D000A", red800:"#5A0015", red700:"#86001F", red600:"#B3002A",
  red500:"#E00034", // Rojo Ibero principal
  red400:"#E6335D", red300:"#EC6685", red200:"#F299B2", red100:"#F9CCDA", red50:"#FCE8EE",
  // Neutrals
  n900:"#1A1A1A", n800:"#2E2E2E", n700:"#424242", n600:"#5A5A5A",
  n500:"#737373", n400:"#8C8C8C", n300:"#ABABAB", n200:"#C9C9C9",
  n100:"#E7E7E7", n50:"#F5F5F5", white:"#FFFFFF",
  // Semantic
  success:"#1A7A3C", successLt:"#E8F5EE", successBr:"#A3D9B8",
  warning:"#8A5C00", warningLt:"#FFF8E7", warningBr:"#FFD97A",
  error:"#C70028", errorLt:"#FDEEF2", errorBr:"#F5A3B7",
  info:"#0057B8", infoLt:"#EEF4FF", infoBr:"#A3C4F5",
  // Shadows
  sh1:"0 1px 2px rgba(0,0,0,0.06)",
  sh2:"0 2px 8px rgba(0,0,0,0.08)",
  sh3:"0 4px 16px rgba(0,0,0,0.10)",
  sh4:"0 8px 32px rgba(0,0,0,0.12)",
};

// ─── TOKENS SHORTCUT ───────────────────────────────────────────────────────
const T = {
  red: DS.red500, redDk: DS.red600, redLt: DS.red50, redBr: DS.red200,
  bg: DS.n50, white: DS.white,
  text: DS.n900, mid: DS.n700, muted: DS.n400,
  border: DS.n100, borderMd: DS.n200,
  green: DS.success, greenLt: DS.successLt, greenBr: DS.successBr,
  amber: DS.warning, amberLt: DS.warningLt, amberBr: DS.warningBr,
  blue: DS.info, blueLt: DS.infoLt, blueBr: DS.infoBr,
  shadow: DS.sh1, shadowMd: DS.sh2, shadowLg: DS.sh4,
};

// ─── 38 CARRERAS REALES IBERO ──────────────────────────────────────────────
const CARRERAS = ["Actuaría","Administración de Empresas","Administración de la Hospitalidad","Arquitectura","Ciencias Políticas y Administración Pública","Ciencias Teológicas","Comunicación","Contaduría y Dirección de Negocios","Derecho","Diseño de Ficciones y Narrativas Transmedia","Diseño de Moda y Textiles Sostenibles","Diseño de Productos y Experiencias","Diseño Sensorial y Dirección Creativa","Economía","Filosofía","Finanzas","Global Business","Historia","Historia del Arte","Ingeniería Biomédica","Ingeniería Civil","Ingeniería de Alimentos","Ingeniería en Biotecnología","Ingeniería en Ciencia de Datos","Ingeniería en Mecatrónica y Sistemas Ciberfísicos","Ingeniería en Tecnologías de Cómputo y Telecomunicaciones","Ingeniería Física","Ingeniería Industrial","Ingeniería Mecánica y Eléctrica","Ingeniería Química","International Relations","Literatura Latinoamericana","Mercadotecnia","Negocios Globales","Nutrición y Ciencia de los Alimentos","Pedagogía","Psicología","Relaciones Internacionales","Sustentabilidad"];
const SEMESTRES = ["1°","2°","3°","4°","5°","6°","7°","8°","9°","10°"];

const ZONAS = {
  poniente:{ label:"Poniente", color:DS.red500, emoji:"🌇", desc:"Zona del campus · Santa Fe y alrededores",
    colonias:[{id:"santafe",n:"Santa Fe",min:5},{id:"lomas",n:"Lomas de Santa Fe",min:8},{id:"interlomas",n:"Interlomas",min:18},{id:"bosques",n:"Bosques de las Lomas",min:15},{id:"huixqui",n:"Huixquilucan",min:22}]},
  norte:{ label:"Norte", color:DS.info, emoji:"🏙️", desc:"Polanco, Lomas de Chapultepec y Anzures",
    colonias:[{id:"polanco",n:"Polanco",min:25},{id:"lomaschap",n:"Lomas de Chapultepec",min:22},{id:"anzures",n:"Anzures",min:30},{id:"naucalpan",n:"Naucalpan",min:28},{id:"granada",n:"Granada",min:35}]},
  sur:{ label:"Sur", color:DS.success, emoji:"🌳", desc:"Coyoacán, Pedregal y San Jerónimo",
    colonias:[{id:"coyoacan",n:"Coyoacán",min:40},{id:"pedregal",n:"Pedregal de San Ángel",min:20},{id:"sanjeronimo",n:"San Jerónimo",min:18},{id:"tlalpan",n:"Tlalpan",min:45},{id:"insurgentes",n:"Insurgentes Sur",min:30}]},
  oriente:{ label:"Oriente", color:DS.warning, emoji:"🏛️", desc:"Condesa, Roma Norte/Sur, Del Valle y Narvarte",
    colonias:[{id:"condesa",n:"Condesa",min:35},{id:"roma",n:"Roma Norte / Sur",min:38},{id:"delvalle",n:"Del Valle",min:42},{id:"narvarte",n:"Narvarte",min:40},{id:"napoles",n:"Nápoles",min:44}]},
};

// ─── HOSPEDAJES (16 con 16 carreras distintas) ────────────────────────────
const HOSPEDAJES = [
  {id:1,zona:"poniente",colonia:"lomas",nombre:"Familia Garza Mora",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:5500,amenidades:["WiFi","Comidas","Jardín","Estudio"],foto:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=70",rating:4.9,reviews:18,disponible:true,genero:"Mixto",verificado:true,descripcion:"Familia con 5 años recibiendo estudiantes IBERO. 8 min caminando al campus.",carreraIdeal:"Arquitectura",contacto:"55 1234-5678"},
  {id:2,zona:"poniente",colonia:"santafe",nombre:"Residencia Santa Fe",modalidad:"catalogo",tipo:"residencia",precio:4200,amenidades:["WiFi","Gym","Seguridad 24h","Comedor"],foto:"https://images.unsplash.com/photo-1560449752-8b6023e2ab5f?w=600&q=70",rating:4.8,reviews:41,disponible:true,genero:"Mixto",verificado:true,descripcion:"Residencia universitaria mixta a 5 minutos del campus.",carreraIdeal:"Ingeniería en Ciencia de Datos",contacto:"55 9876-5432"},
  {id:3,zona:"norte",colonia:"polanco",nombre:"Familia Reyes Olvera",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:8500,amenidades:["WiFi","Alberca","Comedor","Estudio"],foto:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70",rating:5.0,reviews:7,disponible:true,genero:"Mixto",verificado:true,descripcion:"Residencia en Polanco. Ambiente familiar, seguro y tranquilo.",carreraIdeal:"Relaciones Internacionales",contacto:"55 3344-5566"},
  {id:4,zona:"sur",colonia:"coyoacan",nombre:"Sofía Arredondo",modalidad:"catalogo",tipo:"habitacion",precio:4600,amenidades:["WiFi","Jardín","Cocina","Librería"],foto:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=70",rating:4.9,reviews:22,disponible:true,genero:"Femenino",verificado:true,descripcion:"Habitación en casa centenaria de Coyoacán, barrio cultural e histórico.",carreraIdeal:"Historia del Arte",contacto:"55 1122-3344"},
  {id:5,zona:"oriente",colonia:"condesa",nombre:"Andrés Fuentes",modalidad:"catalogo",tipo:"habitacion",precio:6300,amenidades:["WiFi","Terraza","Parque","Cafeterías"],foto:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=70",rating:4.9,reviews:33,disponible:true,genero:"Masculino",verificado:true,descripcion:"Departamento en La Condesa, pasos del Parque México.",carreraIdeal:"Comunicación",contacto:"55 9900-8877"},
  {id:6,zona:"oriente",colonia:"roma",nombre:"Familia Gutiérrez Mora",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:5700,amenidades:["WiFi","Comidas","Terraza","Estudio"],foto:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=70",rating:4.8,reviews:21,disponible:true,genero:"Mixto",verificado:true,descripcion:"Casa en Roma Norte, barrio artístico. Familia joven con experiencia.",carreraIdeal:"Diseño de Productos y Experiencias",contacto:"55 1100-2233"},
  {id:7,zona:"poniente",colonia:"bosques",nombre:"Pablo y Mariana Ríos",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:5900,amenidades:["WiFi","Jardín","Área de diseño","Baño privado"],foto:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=70",rating:4.7,reviews:14,disponible:true,genero:"Mixto",verificado:true,descripcion:"Casa moderna en Bosques con jardín. Ambiente creativo y tranquilo.",carreraIdeal:"Arquitectura",contacto:"55 6677-8899"},
  {id:8,zona:"norte",colonia:"lomaschap",nombre:"Fam. Mendoza Leal",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:7800,amenidades:["WiFi","Alberca","Comidas","Gym"],foto:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=70",rating:4.9,reviews:11,disponible:true,genero:"Femenino",verificado:true,descripcion:"Residencia de lujo en Lomas de Chapultepec. Solo mujeres.",carreraIdeal:"Finanzas",contacto:"55 2233-4455"},
  {id:9,zona:"sur",colonia:"pedregal",nombre:"Torres & Blanco",modalidad:"catalogo",tipo:"departamento",precio:5800,amenidades:["WiFi","Alberca","Comidas","Estudio"],foto:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70",rating:4.8,reviews:16,disponible:true,genero:"Mixto",verificado:true,descripcion:"Departamento en Pedregal con todas las comodidades.",carreraIdeal:"Psicología",contacto:"55 8899-0011"},
  {id:10,zona:"oriente",colonia:"narvarte",nombre:"Isabella Ochoa",modalidad:"catalogo",tipo:"habitacion",precio:4900,amenidades:["WiFi","Cocina","Lavandería","Metro"],foto:"https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=600&q=70",rating:4.7,reviews:12,disponible:true,genero:"Femenino",verificado:false,descripcion:"Habitación en Narvarte, zona muy segura y conectada.",carreraIdeal:"Nutrición y Ciencia de los Alimentos",contacto:"55 4411-2233"},
  {id:11,zona:"norte",colonia:"anzures",nombre:"Valentina Romo",modalidad:"catalogo",tipo:"habitacion",precio:5100,amenidades:["WiFi","Cocina","Balcón","Sala"],foto:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=70",rating:4.7,reviews:19,disponible:true,genero:"Femenino",verificado:false,descripcion:"Habitación luminosa en Anzures, excelente transporte público.",carreraIdeal:"Derecho",contacto:"55 7788-9900"},
  {id:12,zona:"sur",colonia:"sanjeronimo",nombre:"Familia López Vega",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:5200,amenidades:["WiFi","Comidas","Patio","Garage"],foto:"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=70",rating:4.8,reviews:27,disponible:true,genero:"Mixto",verificado:true,descripcion:"Familia establecida en San Jerónimo. Comidas incluidas.",carreraIdeal:"Pedagogía",contacto:"55 6600-7711"},
  {id:13,zona:"poniente",colonia:"interlomas",nombre:"Fam. Castillo Lugo",modalidad:"hogar_ibero",tipo:"hogar_ibero",precio:4800,amenidades:["WiFi","Comidas","Área de estudio","Patio"],foto:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=70",rating:4.9,reviews:24,disponible:true,genero:"Mixto",verificado:true,descripcion:"Familia en Interlomas, 18 min al campus. Ambiente cálido.",carreraIdeal:"Economía",contacto:"55 5566-7788"},
  {id:14,zona:"oriente",colonia:"delvalle",nombre:"Paola y Rodrigo E.",modalidad:"catalogo",tipo:"departamento",precio:6100,amenidades:["WiFi","Gym","Cocina","Lavandería"],foto:"https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=70",rating:4.6,reviews:9,disponible:true,genero:"Mixto",verificado:true,descripcion:"Departamento moderno en Del Valle con todas las amenidades.",carreraIdeal:"Administración de Empresas",contacto:"55 3344-5577"},
  {id:15,zona:"norte",colonia:"naucalpan",nombre:"Fam. Mendoza Torres",modalidad:"catalogo",tipo:"residencia",precio:3900,amenidades:["WiFi","Comidas","Jardín","Garaje"],foto:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",rating:4.6,reviews:31,disponible:true,genero:"Mixto",verificado:true,descripcion:"Residencia económica en Naucalpan. Comidas incluidas.",carreraIdeal:"Ingeniería Industrial",contacto:"55 4455-6677"},
  {id:16,zona:"sur",colonia:"insurgentes",nombre:"Carlos Muñoz",modalidad:"catalogo",tipo:"habitacion",precio:3800,amenidades:["WiFi","Cocina","Bicicleta","Metro"],foto:"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=70",rating:4.7,reviews:8,disponible:false,genero:"Masculino",verificado:true,descripcion:"Habitación en Insurgentes Sur cerca del metro y campus.",carreraIdeal:"Sustentabilidad",contacto:"55 2200-1199"},
];

// ─── BUDDIES ───────────────────────────────────────────────────────────────
const BUDDIES = [
  {id:1,nombre:"Sofía Arredondo",carrera:"Relaciones Internacionales",sem:"6°",zona:"oriente",colonia:"condesa",tipo:"anfitrion",genero:"F",intereses:["Política","Viajes","Fotografía"],idiomas:["Español","Inglés","Francés"],precio:6200,avatar:"SA",ig:"@sofia.arr",wa:"5512345678",bio:"Depto luminoso en Condesa, 2 min del Parque México."},
  {id:2,nombre:"Diego Herrera",carrera:"Ingeniería en Ciencia de Datos",sem:"8°",zona:"poniente",colonia:"santafe",tipo:"anfitrion",genero:"M",intereses:["Tecnología","Música","Deportes"],idiomas:["Español","Inglés"],precio:4800,avatar:"DH",ig:"@diego.hdev",wa:"5523456789",bio:"Habitación con gym y rooftop. 5 min campus. WiFi 500MB."},
  {id:3,nombre:"Valentina Romo",carrera:"Comunicación",sem:"6°",zona:"norte",colonia:"anzures",tipo:"anfitrion",genero:"F",intereses:["Arte","Cine","Gastronomía"],idiomas:["Español","Inglés","Italiano"],precio:5100,avatar:"VR",ig:"@vale.romo",wa:"5534567890",bio:"Departamento luminoso en Anzures con balcón."},
  {id:4,nombre:"Andrés Muñoz",carrera:"Filosofía",sem:"5°",zona:"sur",colonia:"coyoacan",tipo:"anfitrion",genero:"M",intereses:["Literatura","Cine","Arte"],idiomas:["Español","Inglés","Alemán"],precio:4400,avatar:"AM",ig:"@andres.m",wa:"5545678901",bio:"Casa centenaria en Coyoacán con jardín bohemio."},
  {id:5,nombre:"Camila Serrano",carrera:"Diseño Sensorial y Dirección Creativa",sem:"7°",zona:"oriente",colonia:"roma",tipo:"anfitrion",genero:"F",intereses:["Arte","Fotografía","Gastronomía"],idiomas:["Español","Inglés","Portugués"],precio:5600,avatar:"CS",ig:"@cami.design",wa:"5556789012",bio:"Estudio en Roma Norte. Pisos de madera, techos altos."},
  {id:6,nombre:"Renata Olivares",carrera:"Comunicación",sem:"5°",zona:"oriente",colonia:"roma",tipo:"busca",genero:"F",intereses:["Fotografía","Arte","Gastronomía"],idiomas:["Español","Inglés"],wa:"5512340987",avatar:"RO",bio:"Busco compañera de habitación en Roma o Condesa."},
  {id:7,nombre:"Sebastián Cruz",carrera:"Ingeniería en Ciencia de Datos",sem:"6°",zona:"poniente",colonia:"santafe",tipo:"busca",genero:"M",intereses:["Tecnología","Deportes","Música"],idiomas:["Español","Inglés","Portugués"],wa:"5523451098",avatar:"SC",bio:"Habitación cerca del campus. Trabajo remoto, necesito buen WiFi."},
  {id:8,nombre:"Ximena Paredes",carrera:"Diseño de Moda y Textiles Sostenibles",sem:"7°",zona:"norte",colonia:"polanco",tipo:"busca",genero:"F",intereses:["Arte","Cine","Viajes"],idiomas:["Español","Francés","Inglés"],wa:"5534562109",avatar:"XP",bio:"Familia anfitriona en zona norte. Preferiblemente Polanco."},
  {id:9,nombre:"Emilio Vargas",carrera:"Relaciones Internacionales",sem:"4°",zona:"sur",colonia:"coyoacan",tipo:"busca",genero:"M",intereses:["Política","Viajes","Literatura"],idiomas:["Español","Inglés","Alemán"],wa:"5545673210",avatar:"EV",bio:"Anfitrión en Coyoacán o Pedregal. Tranquilo y estudioso."},
  {id:10,nombre:"Lucía Moreno",carrera:"Psicología",sem:"8°",zona:"oriente",colonia:"narvarte",tipo:"busca",genero:"F",intereses:["Literatura","Gastronomía","Cine"],idiomas:["Español","Inglés"],wa:"5556784321",avatar:"LM",bio:"Familia anfitriona en Narvarte o Del Valle."},
];

// ─── DOCUMENTOS PDF URLS (simulados) ──────────────────────────────────────
const DOCS_PDF = {
  aviso: "https://www.ibero.mx/aviso-privacidad.pdf",
  acuerdo: "https://www.ibero.mx/acuerdo-publicacion.pdf",
};

const DOCS_PROV = [
  {id:"aviso_privacidad",nombre:"Aviso de privacidad",req:true,desc:"Consentimiento para datos personales",tipo:"firma",accept:".pdf,.jpg,.png",pdfUrl:DOCS_PDF.aviso},
  {id:"acuerdo_publicacion",nombre:"Acuerdo de publicación",req:true,desc:"Responsiva de publicación para anfitriones",tipo:"firma",accept:".pdf,.jpg,.png",pdfUrl:DOCS_PDF.acuerdo},
  {id:"ine_frente",nombre:"INE frente (vigente)",req:true,desc:"Identificación del responsable — frente",tipo:"ine",accept:".jpg,.jpeg,.png,.pdf"},
  {id:"ine_vuelta",nombre:"INE vuelta",req:true,desc:"Identificación del responsable — reverso",accept:".jpg,.jpeg,.png,.pdf"},
  {id:"posesion",nombre:"Documento de posesión legal",req:true,desc:"Título de propiedad, predial o autorización para subarrendar",accept:".pdf,.jpg,.png"},
  {id:"comprobante_domicilio",nombre:"Comprobante de domicilio",req:true,desc:"Máx. 3 meses de antigüedad",accept:".pdf,.jpg,.png"},
  {id:"comprobante_pago",nombre:"Comprobante de pago $400 MXN",req:true,desc:"Solo Proveedor de Servicios",tipo:"pago",accept:".pdf,.jpg,.png",soloProveedor:true},
];

const FOTO_CATS_STD = [
  {id:"recamara1",label:"Recámara 1"},{id:"recamara2",label:"Recámara 2"},
  {id:"cocina",label:"Cocina"},{id:"sala",label:"Sala"},
  {id:"bano",label:"Baño"},{id:"exterior",label:"Exterior / Fachada"},
  {id:"jardin",label:"Jardín / Patio"},{id:"comedor",label:"Comedor"},
];

const validarRFC = (rfc) => {
  if(!rfc) return "RFC requerido";
  const r = rfc.toUpperCase().trim();
  if(!/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(r)) return "Formato inválido: AAAA######AAA";
  return null;
};

// ─── STORAGE ───────────────────────────────────────────────────────────────
const ST = {
  get: async(k) => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; }},
  set: async(k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch(e){console.error(e);}},
};

// ─── IBERO LOGO (Design System oficial — pastilla roja) ───────────────────
const Logo = ({height=36, white=false}) => (
  <div style={{display:"flex",alignItems:"center",gap:0}}>
    <div style={{background:white?"rgba(255,255,255,0.15)":DS.red500,borderRadius:white?8:10,padding:${height*0.18}px ${height*0.32}px,display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
      <span style={{color:"white",fontWeight:900,fontSize:height*0.55,fontFamily:"'Plus Jakarta Sans','Outfit',system-ui,sans-serif",letterSpacing:"-0.02em",lineHeight:1}}>IBERO</span>
      <span style={{color:"rgba(255,255,255,0.85)",fontWeight:400,fontSize:height*0.22,letterSpacing:"0.08em",lineHeight:1.2}}>CIUDAD DE MÉXICO</span>
    </div>
  </div>
);

// ─── DESIGN SYSTEM COMPONENTS ──────────────────────────────────────────────
const btn = (v="primary",sz="md") => {
  const sz_={xs:{fontSize:10,padding:"4px 10px",borderRadius:6},sm:{fontSize:11,padding:"6px 12px",borderRadius:7},md:{fontSize:13,padding:"9px 18px",borderRadius:8},lg:{fontSize:14,padding:"12px 24px",borderRadius:9}};
  const v_={
    primary:{background:DS.red500,color:"#fff",border:"none"},
    primaryDk:{background:DS.red700,color:"#fff",border:"none"},
    outline:{background:"transparent",color:DS.red500,border:1.5px solid ${DS.red500}},
    ghost:{background:"transparent",color:DS.n700,border:1.5px solid ${DS.n200}},
    success:{background:DS.success,color:"#fff",border:"none"},
    danger:{background:DS.errorLt,color:DS.error,border:1.5px solid ${DS.errorBr}},
    white:{background:"white",color:DS.red500,border:"none"},
  };
  return {display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontWeight:600,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.01em",transition:"all 0.15s",...sz_[sz],...v_[v]};
};

const inp = {width:"100%",background:DS.white,border:1.5px solid ${DS.n200},borderRadius:8,padding:"9px 12px",fontSize:13,color:DS.n900,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"};
const lbl = {fontSize:11,fontWeight:700,color:DS.n600,display:"block",marginBottom:5,letterSpacing:"0.05em",textTransform:"uppercase"};
const card = {background:DS.white,border:1px solid ${DS.n100},borderRadius:12,boxShadow:DS.sh1};
const cardMd = {background:DS.white,border:1px solid ${DS.n100},borderRadius:16,boxShadow:DS.sh2};

const StatusBadge = ({st}) => {
  const m={complete:{bg:DS.successLt,br:DS.successBr,c:DS.success,l:"Cargado ✓"},pending:{bg:DS.n50,br:DS.n200,c:DS.n500,l:"Pendiente"},inprogress:{bg:DS.warningLt,br:DS.warningBr,c:DS.warning,l:"En revisión"},approved:{bg:DS.successLt,br:DS.successBr,c:DS.success,l:"Aprobado ✓"},rejected:{bg:DS.errorLt,br:DS.errorBr,c:DS.error,l:"Rechazado"},published:{bg:DS.infoLt,br:DS.infoBr,c:DS.info,l:"Publicado ✓"},paid:{bg:"#F0E6FF",br:"#C9A3F5",c:"#7B2FBE",l:"Pagada ✓"}};
  const d=m[st]||m.pending;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:d.bg,border:1px solid ${d.br},color:d.c,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{d.l}</span>;
};

const Stars = ({r,n=0,sz=12}) => <span style={{fontSize:sz,color:"#F59E0B"}}>{"★".repeat(Math.floor(r))}<span style={{color:DS.n600,fontWeight:600,marginLeft:3}}>{r}{n>0&&<span style={{fontWeight:400,fontSize:sz-1}}> ({n})</span>}</span></span>;

const SH = ({eyebrow,title,sub,sm=false}) => (
  <div style={{marginBottom:sm?14:20}}>
    {eyebrow&&<div style={{fontSize:10,color:DS.red500,fontWeight:700,letterSpacing:"0.12em",marginBottom:4,textTransform:"uppercase"}}>{eyebrow}</div>}
    <h2 style={{fontSize:sm?16:20,fontWeight:800,color:DS.n900,margin:"0 0 4px",letterSpacing:"-0.02em"}}>{title}</h2>
    {sub&&<p style={{fontSize:13,color:DS.n500,margin:0,lineHeight:1.6}}>{sub}</p>}
  </div>
);

const Toast = ({msg,type="success",onClose}) => {
  const c={success:{bg:DS.successLt,br:DS.successBr,col:DS.success,ic:"✓"},error:{bg:DS.errorLt,br:DS.errorBr,col:DS.error,ic:"✕"},info:{bg:DS.infoLt,br:DS.infoBr,col:DS.info,ic:"ℹ"},warning:{bg:DS.warningLt,br:DS.warningBr,col:DS.warning,ic:"⚠"}}[type];
  useEffect(()=>{const t=setTimeout(onClose,4000);return()=>clearTimeout(t);},[]);
  return <div style={{position:"fixed",bottom:24,right:24,zIndex:999,background:c.bg,border:1px solid ${c.br},color:c.col,fontSize:13,fontWeight:600,padding:"12px 18px",borderRadius:10,boxShadow:DS.sh4,display:"flex",alignItems:"center",gap:10,maxWidth:320}}>{c.ic} {msg}<button onClick={onClose} style={{background:"none",border:"none",color:c.col,cursor:"pointer",marginLeft:6,flexShrink:0}}>✕</button></div>;
};

const Modal = ({title,sub,onClose,children,wide=false,nopad=false}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(26,26,26,0.5)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",padding:16}} onClick={onClose}>
    <div style={{...cardMd,width:min(${wide?"820px":"520px"},96vw),maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:"16px 22px",borderBottom:1px solid ${DS.n100},display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"sticky",top:0,background:DS.white,zIndex:1}}>
        <div><h2 style={{fontSize:16,fontWeight:800,color:DS.n900,margin:0}}>{title}</h2>{sub&&<p style={{fontSize:11,color:DS.n500,margin:"2px 0 0"}}>{sub}</p>}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:DS.n400,cursor:"pointer",lineHeight:1,padding:2}}>✕</button>
      </div>
      <div style={{padding:nopad?0:"20px 22px"}}>{children}</div>
    </div>
  </div>
);

// ─── FILE UPLOADER ─────────────────────────────────────────────────────────
function FileUploader({docId,accept,current,onUpload}) {
  const [drag,setDrag]=useState(false);
  const [prog,setProg]=useState(0);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const ref=useRef();
  const process=(file)=>{
    if(!file){setErr("Archivo no válido");return;}
    const ext="."+file.name.split(".").pop().toLowerCase();
    if(!accept.split(",").map(s=>s.trim().toLowerCase()).includes(ext)){setErr(Formato no permitido: ${accept});return;}
    setErr(null);setLoading(true);setProg(0);
    const iv=setInterval(()=>setProg(p=>{if(p>=100){clearInterval(iv);setLoading(false);onUpload(docId,file.name);return 100;}return Math.min(p+Math.random()*28,99);}),160);
  };
  if(current) return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:DS.successLt,border:1px solid ${DS.successBr},borderRadius:8}}>
      <span style={{fontSize:16}}>📄</span>
      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:DS.success}}>{current}</div><div style={{fontSize:10,color:DS.success,opacity:0.75}}>Cargado correctamente</div></div>
      <button onClick={()=>onUpload(docId,null)} style={{background:"none",border:"none",color:DS.n400,cursor:"pointer",fontSize:16}}>✕</button>
    </div>
  );
  return (
    <div>
      <div onDragEnter={e=>{e.preventDefault();setDrag(true)}} onDragOver={e=>e.preventDefault()} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);process(e.dataTransfer.files[0]);}} onClick={()=>!loading&&ref.current.click()}
        style={{border:2px dashed ${drag?DS.red500:err?DS.error:DS.n200},borderRadius:8,padding:"14px 18px",textAlign:"center",cursor:"pointer",background:drag?DS.red50:DS.n50,transition:"all 0.15s"}}>
        <input ref={ref} type="file" accept={accept} style={{display:"none"}} onChange={e=>process(e.target.files[0])}/>
        {loading?(<div><div style={{fontSize:11,color:DS.n600,marginBottom:6}}>Verificando y cargando...</div><div style={{height:4,background:DS.n100,borderRadius:2}}><div style={{height:"100%",width:${Math.round(prog)}%,background:DS.red500,borderRadius:2,transition:"width 0.2s"}}/></div><div style={{fontSize:10,color:DS.n400,marginTop:3}}>{Math.min(Math.round(prog),100)}%</div></div>)
        :(<div><div style={{fontSize:20,marginBottom:4}}>📁</div><div style={{fontSize:11,color:DS.n600}}>Arrastra o <span style={{color:DS.red500,fontWeight:700}}>haz clic para seleccionar</span></div><div style={{fontSize:10,color:DS.n400,marginTop:2}}>{accept}</div></div>)}
      </div>
      {err&&<div style={{fontSize:11,color:DS.error,marginTop:4,fontWeight:600}}>⚠ {err}</div>}
    </div>
  );
}

// ─── INE UPLOADER ──────────────────────────────────────────────────────────
function IneUploader({docId,current,onUpload}) {
  const [vigencia,setVigencia]=useState("");
  const [vErr,setVErr]=useState(null);
  const today=new Date(); today.setHours(0,0,0,0);
  const check=(v)=>{setVigencia(v);if(!v){setVErr(null);return;}const d=new Date(v+"T00:00:00");if(d<=today){setVErr("INE vencida — no se puede subir.");return;}if((d-today)<30*86400000)setVErr("INE vence en menos de 30 días.");else setVErr(null);};
  return (
    <div>
      <label style={lbl}>Fecha de vigencia de la INE</label>
      <input type="date" value={vigencia} onChange={e=>check(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{...inp,border:1.5px solid ${vErr?DS.error:vigencia&&!vErr?DS.success:DS.n200},marginBottom:8}}/>
      {vErr&&<div style={{fontSize:11,color:DS.error,marginBottom:8,fontWeight:600}}>⚠ {vErr} Solo se acepta INE vigente.</div>}
      {vigencia&&!vErr&&<div style={{fontSize:11,color:DS.success,marginBottom:8,fontWeight:600}}>✓ INE vigente — puedes cargar el archivo</div>}
      {vigencia&&!vErr?<FileUploader docId={docId} accept=".jpg,.jpeg,.png,.pdf" current={current} onUpload={onUpload}/>
      :<div style={{padding:"12px 16px",background:DS.n50,border:1.5px solid ${DS.n200},borderRadius:8,fontSize:11,color:DS.n400,textAlign:"center"}}>Ingresa la vigencia de tu INE para habilitar la carga del archivo</div>}
    </div>
  );
}

// ─── PHOTO UPLOADER ────────────────────────────────────────────────────────
function PhotoUploader({photos,setPhotos,minRequired=4}) {
  const [customName,setCustomName]=useState("");
  const [adding,setAdding]=useState(false);
  const stdDone=FOTO_CATS_STD.filter(c=>photos[c.id]).length;
  const customPhotos=Object.entries(photos).filter(([k])=>!FOTO_CATS_STD.find(c=>c.id===k));
  const total=Object.keys(photos).length;
  const handleFile=(catId,file)=>{if(!file)return;const url=URL.createObjectURL(file);setPhotos(p=>({...p,[catId]:{url,name:file.name,label:catId}}));};
  const addCustom=()=>{if(!customName.trim())return;const id="custom_"+Date.now();setPhotos(p=>({...p,[id]:{url:null,name:"",label:customName.trim(),pending:true}}));setCustomName("");setAdding(false);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><span style={{fontSize:13,fontWeight:700,color:DS.n900}}>Fotografías del inmueble</span><div style={{fontSize:11,color:DS.n500,marginTop:2}}>Mínimo {minRequired} para continuar · {total} cargadas</div></div>
        <span style={{fontSize:12,fontWeight:700,color:total>=minRequired?DS.success:DS.warning}}>{total}/{minRequired} {total>=minRequired?"✓ Mínimo cumplido":"pendiente"}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:12}}>
        {FOTO_CATS_STD.map(cat=>(
          <div key={cat.id}>
            <div style={{fontSize:10,color:DS.n600,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>{cat.label}</div>
            {photos[cat.id]?(
              <div style={{position:"relative",height:95,borderRadius:8,overflow:"hidden",border:1px solid ${DS.successBr}}}>
                <img src={photos[cat.id].url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <button onClick={()=>setPhotos(p=>{const n={...p};delete n[cat.id];return n;})} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ):(
              <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:95,borderRadius:8,border:2px dashed ${DS.n200},background:DS.n50,cursor:"pointer",gap:4}}>
                <input type="file" accept=".jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>handleFile(cat.id,e.target.files[0])}/>
                <span style={{fontSize:18,color:DS.n400}}>+</span>
                <span style={{fontSize:10,color:DS.n400}}>Subir</span>
              </label>
            )}
          </div>
        ))}
        {/* Fotos personalizadas */}
        {customPhotos.map(([k,ph])=>(
          <div key={k}>
            <div style={{fontSize:10,color:DS.n600,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ph.label}</div>
            {ph.url?(
              <div style={{position:"relative",height:95,borderRadius:8,overflow:"hidden",border:1px solid ${DS.successBr}}}>
                <img src={ph.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <button onClick={()=>setPhotos(p=>{const n={...p};delete n[k];return n;})} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:10}}>✕</button>
              </div>
            ):(
              <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:95,borderRadius:8,border:2px dashed ${DS.n200},background:DS.n50,cursor:"pointer",gap:4}}>
                <input type="file" accept=".jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){const url=URL.createObjectURL(e.target.files[0]);setPhotos(p=>({...p,[k]:{...p[k],url,name:e.target.files[0].name}}));}}}/>
                <span style={{fontSize:18,color:DS.n400}}>+</span>
                <span style={{fontSize:10,color:DS.n400}}>Subir</span>
              </label>
            )}
          </div>
        ))}
        {/* Agregar personalizada */}
        {adding?(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Nombre (ej. Estudio)" style={{...inp,fontSize:11}} autoFocus onKeyDown={e=>e.key==="Enter"&&addCustom()}/>
            <div style={{display:"flex",gap:4}}>
              <button onClick={addCustom} style={{...btn("primary","xs"),flex:1}}>Agregar</button>
              <button onClick={()=>setAdding(false)} style={{...btn("ghost","xs"),flex:1}}>Cancelar</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setAdding(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:95,borderRadius:8,border:2px dashed ${DS.red200},background:DS.red50,cursor:"pointer",gap:4,width:"100%",color:DS.red500,fontSize:11,fontWeight:600}}>
            + Otra foto<span style={{fontSize:10,fontWeight:400,color:DS.red400}}>con nombre propio</span>
          </button>
        )}
      </div>
      {total<minRequired&&<div style={{padding:"10px 14px",background:DS.warningLt,border:1px solid ${DS.warningBr},borderRadius:8,fontSize:11,color:DS.warning}}>⚠ Necesitas al menos {minRequired} fotos para continuar. Actualmente tienes {total}.</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── PROVEEDOR APP ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function ProveedorApp({back}) {
  const [view,setView]=useState("landing"); // landing | registro | dashboard
  const [page,setPage]=useState("inicio");
  const [profile,setProfile]=useState(null);
  const [docs,setDocs]=useState({});
  const [photos,setPhotos]=useState({});
  const [toast,setToast]=useState(null);
  useEffect(()=>{(async()=>{const p=await ST.get("prov-profile");const d=await ST.get("prov-docs");const ph=await ST.get("prov-photos");if(p){setProfile(p);setView("dashboard");}if(d)setDocs(d);if(ph)setPhotos(ph);})();},[]);
  const saveProfile=async(p)=>{setProfile(p);await ST.set("prov-profile",p);};
  const saveDoc=async(id,fn)=>{const nd={...docs,[id]:fn};setDocs(nd);await ST.set("prov-docs",nd);if(fn)notify("${fn}" cargado correctamente);};
  const savePhotos=async(ph)=>{setPhotos(ph);await ST.set("prov-photos",ph);};
  const notify=(msg,type="success")=>setToast({msg,type});
  const isHogar=profile?.tipo==="hogar_ibero";
  const navItems=profile?[{id:"inicio",l:"Inicio",ic:"🏠"},{id:"expediente",l:"Mi expediente",ic:"📁"},{id:"anuncio",l:"Mi anuncio",ic:"📋"},{id:"encuestas",l:"Encuestas",ic:"⭐"},{id:"facturas",l:"Facturas",ic:"💰"}]:[];

  if(view==="landing") return <ProvLanding onSelect={(tipo)=>{setView("registro");}} onIngreso={()=>setView("dashboard")} hasProfile={!!profile} onBack={back}/>;
  if(view==="registro") return <ProvRegistro onSave={async(p)=>{await saveProfile(p);setView("dashboard");notify("Perfil guardado ✓");}} onBack={()=>setView("landing")} photos={photos} setPhotos={savePhotos} notify={notify}/>;

  return (
    <div style={{display:"grid",gridTemplateColumns:"210px 1fr",minHeight:"calc(100vh - 62px)"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={{background:DS.white,borderRight:1px solid ${DS.n100},padding:"18px 14px",display:"flex",flexDirection:"column"}}>
        {profile&&<div style={{padding:"10px 12px",background:DS.red50,border:1px solid ${DS.red200},borderRadius:10,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:DS.red500,marginBottom:2}}>{isHogar?"Hogar IBERO":"Proveedor de Servicios"}</div>
          <div style={{fontSize:12,color:DS.red600,fontWeight:600}}>{profile.nombre||"Mi perfil"}</div>
          <div style={{marginTop:5}}><StatusBadge st={profile.status||"pending"}/></div>
        </div>}
        <div style={{flex:1}}>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>setPage(item.id)} style={{width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:page===item.id?700:400,background:page===item.id?DS.red50:"transparent",color:page===item.id?DS.red500:DS.n700,marginBottom:2,transition:"all 0.15s"}}>
              <span style={{fontSize:15}}>{item.ic}</span>{item.l}
            </button>
          ))}
        </div>
        <div style={{borderTop:1px solid ${DS.n100},paddingTop:14}}>
          <button onClick={back} style={{...btn("ghost","sm"),width:"100%",justifyContent:"center",fontSize:11}}>← Salir</button>
        </div>
      </div>
      <div style={{background:DS.n50,overflowY:"auto"}}>
        {page==="inicio"&&<ProvInicio profile={profile} docs={docs} photos={photos}/>}
        {page==="expediente"&&<ProvExpedienteHub profile={profile} docs={docs} onUpload={saveDoc} photos={photos} setPhotos={savePhotos} notify={notify}/>}
        {page==="anuncio"&&<ProvAnuncio profile={profile} onSave={async(p)=>{await saveProfile({...profile,...p});notify("Anuncio actualizado");}}/>}
        {page==="encuestas"&&<ProvEncuestas/>}
        {page==="facturas"&&<ProvFacturas profile={profile} notify={notify}/>}
      </div>
    </div>
  );
}

function ProvLanding({onSelect,onIngreso,hasProfile,onBack}) {
  return (
    <div style={{maxWidth:820,margin:"0 auto",padding:"44px 24px"}}>
      <button onClick={onBack} style={{...btn("ghost","sm"),marginBottom:20}}>← Salir</button>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:10,color:DS.red500,fontWeight:700,letterSpacing:"0.1em",marginBottom:8}}>PORTAL DE ANFITRIONES</div>
        <h1 style={{fontSize:24,fontWeight:900,color:DS.n900,margin:"0 0 10px"}}>¿Tienes un espacio para compartir?</h1>
        <p style={{fontSize:13,color:DS.n500,maxWidth:480,margin:"0 auto",lineHeight:1.7}}>Todo el proceso es digital. Sin necesidad de enviar documentos por correo.</p>
      </div>
      {/* Acceso para anfitriones existentes */}
      {hasProfile&&(
        <div style={{...card,padding:"16px 20px",marginBottom:20,border:1px solid ${DS.successBr},background:DS.successLt,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:13,fontWeight:700,color:DS.success}}>Ya tienes un perfil activo</div><div style={{fontSize:11,color:DS.success,opacity:0.8}}>Accede para gestionar tu expediente y anuncio</div></div>
          <button onClick={onIngreso} style={btn("success","md")}>Ingresar a mi perfil →</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
        {/* HOGAR IBERO */}
        <div style={{...cardMd,padding:"26px 22px",border:2px solid ${DS.red200}}}>
          <div style={{background:DS.red500,color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,display:"inline-block",marginBottom:12}}>SIN COSTO DE REGISTRO</div>
          <h3 style={{fontSize:17,fontWeight:800,color:DS.n900,margin:"0 0 8px"}}>🏡 Hogar IBERO</h3>
          <p style={{fontSize:12,color:DS.n600,lineHeight:1.7,marginBottom:14}}>Casa o departamento familiar. La IBERO actúa como intermediario: gestiona el contacto, los pagos y el contrato. Requiere capacidad de facturar.</p>
          <ul style={{fontSize:12,color:DS.n600,lineHeight:2.1,paddingLeft:16,margin:"0 0 18px"}}>
            <li>Máx. 10 min caminando o 40 min en transporte al campus</li>
            <li>Pagos gestionados a través de la IBERO</li>
            <li>Contrato institucional incluido</li>
          </ul>
          <button onClick={()=>onSelect("hogar_ibero")} style={{...btn("primary","lg"),width:"100%",justifyContent:"center"}}>Registrar Hogar IBERO</button>
        </div>
        {/* PROVEEDOR */}
        <div style={{...cardMd,padding:"26px 22px"}}>
          <div style={{background:DS.n700,color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,display:"inline-block",marginBottom:12}}>$400 MXN · 2 AÑOS</div>
          <h3 style={{fontSize:17,fontWeight:800,color:DS.n900,margin:"0 0 8px"}}>🏢 Proveedor de Servicios</h3>
          <p style={{fontSize:12,color:DS.n600,lineHeight:1.7,marginBottom:14}}>Residencias, departamentos o habitaciones. La IBERO solo es enlace entre las partes, sin responsabilidad legal ni económica del contrato.</p>
          <ul style={{fontSize:12,color:DS.n600,lineHeight:2.1,paddingLeft:16,margin:"0 0 8px"}}>
            <li>Residencias · Departamentos · Habitaciones</li>
            <li>Contrato directo entre anfitrión y alumno</li>
            <li>Promoción por 2 años en la base de datos IBERO</li>
          </ul>
          <div style={{fontSize:11,color:DS.n400,marginBottom:16,padding:"8px 10px",background:DS.n50,borderRadius:7,lineHeight:1.6}}>La Oficina de Hospedaje es solo enlace. Sin responsabilidad legal ni económica.</div>
          <button onClick={()=>onSelect("proveedor")} style={{...btn("ghost","lg"),width:"100%",justifyContent:"center"}}>Registrar como Proveedor</button>
        </div>
      </div>
      <div style={{...card,padding:"14px 18px",display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:18}}>📧</span>
        <div style={{fontSize:12,color:DS.n600}}><strong style={{color:DS.n900}}>Aranza García</strong> · Coordinación de Movilidad Estudiantil · <span style={{color:DS.red500}}>aranza.garcia@ibero.mx</span> · ext. 4018 · Edificio E, Planta Baja</div>
      </div>
    </div>
  );
}

function ProvRegistro({onSave,onBack,photos,setPhotos,notify}) {
  const [tipo,setTipo]=useState(null);
  const [step,setStep]=useState(0);
  const [data,setData]=useState({});
  const set=(k,v)=>setData(d=>({...d,[k]:v}));
  const isHogar=tipo==="hogar_ibero";
  const TOTAL=isHogar?6:7;
  const colonias=data.zona?ZONAS[data.zona]?.colonias||[]:[];
  const [rfcErr,setRfcErr]=useState(null);
  const photosCount=Object.values(photos).filter(p=>p?.url).length;
  const canNext=()=>{
    if(step===0)return!!tipo;
    if(step===1&&!isHogar)return!!data.categoria;
    if(step===2)return data.nombre&&data.zona&&data.colonia&&data.contacto_tel;
    if(step===3)return data.acepto_privacidad&&data.acepto_publicacion;
    if(step===4)return photosCount>=4;
    if(step===5)return data.espacio_ofertado&&data.precio;
    return true;
  };
  const nextStep=()=>{if(!canNext())return;if(isHogar&&step===1){setStep(2);}else{setStep(s=>s+1);}};

  const renderStep=()=>{
    // 0 — Tipo (EXCLUSIVO)
    if(step===0)return(
      <div>
        <SH sm title="¿Cómo deseas registrarte?" sub="Elige una opción. Una vez seleccionada, el proceso es específico para ese tipo."/>
        {[{v:"hogar_ibero",l:"🏡 Hogar IBERO",d:"Sin costo · IBERO como intermediario · Pagos institucionales"},{v:"proveedor",l:"🏢 Proveedor de Servicios",d:"$400 MXN · IBERO solo como enlace · Contrato directo"}].map(op=>(
          <div key={op.v} onClick={()=>setTipo(op.v)} style={{padding:"16px 18px",border:2px solid ${tipo===op.v?DS.red500:DS.n200},background:tipo===op.v?DS.red50:DS.white,borderRadius:12,marginBottom:10,cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:14,fontWeight:700,color:DS.n900}}>{op.l}</div>
            <div style={{fontSize:12,color:DS.n500,marginTop:3}}>{op.d}</div>
          </div>
        ))}
        {tipo&&<div style={{padding:"12px 16px",background:tipo==="hogar_ibero"?DS.red50:DS.warningLt,border:1px solid ${tipo==="hogar_ibero"?DS.red200:DS.warningBr},borderRadius:8,fontSize:12,color:tipo==="hogar_ibero"?DS.red600:DS.warning,marginTop:4}}>
          {tipo==="hogar_ibero"?"Al seleccionar Hogar IBERO aceptas que la institución actuará como intermediario y gestionará los pagos.":"Al seleccionar Proveedor, la IBERO solo publicará tu inmueble. El contrato es directo entre tú y el alumno."}
        </div>}
      </div>
    );
    // 1 — Categoría (solo proveedor)
    if(step===1&&!isHogar)return(
      <div>
        <SH sm title="Categoría del inmueble"/>
        {[{id:"residencia",l:"🏢 Residencia",d:"Para mujeres, hombres o mixta",c:"Mín. 5 meses"},{id:"departamento",l:"🏠 Departamento amueblado/sin amueblar",d:"Completo o por habitación",c:"Mín. 1 año"},{id:"habitacion",l:"🛏️ Habitación en casa o departamento",d:"Habitación individual en inmueble compartido",c:"5 meses"}].map(cat=>(
          <div key={cat.id} onClick={()=>set("categoria",cat.id)} style={{display:"flex",gap:14,padding:"13px 16px",border:2px solid ${data.categoria===cat.id?DS.red500:DS.n200},background:data.categoria===cat.id?DS.red50:DS.white,borderRadius:11,marginBottom:8,cursor:"pointer"}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:DS.n900}}>{cat.l}</div><div style={{fontSize:11,color:DS.n500}}>{cat.d}</div><div style={{fontSize:10,color:DS.n400,marginTop:2}}>Contrato: {cat.c}</div></div>
          </div>
        ))}
      </div>
    );
    // 2 — Datos del responsable
    if(step===2)return(
      <div>
        <SH sm title="Datos del responsable e inmueble"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["nombre","Nombre completo del responsable"],["contacto_tel","Teléfono de contacto"],["contacto_email","Correo electrónico"]].map(([k,l])=>(
            <div key={k}><label style={lbl}>{l}</label>
              <input value={data[k]||""} onChange={e=>{const v=e.target.value;if(k==="nombre"&&!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/.test(v))return;if(k==="contacto_tel"&&!/^[0-9\s\-\+()]$/.test(v))return;set(k,v);}} style={inp} placeholder={l}/>
            </div>
          ))}
          <div>
            <label style={lbl}>Zona CDMX</label>
            <select value={data.zona||""} onChange={e=>{set("zona",e.target.value);set("colonia","");}} style={inp}>
              <option value="">Selecciona zona</option>
              {Object.entries(ZONAS).map(([id,z])=><option key={id} value={id}>Zona {z.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Colonia</label>
            <select value={data.colonia||""} onChange={e=>set("colonia",e.target.value)} style={inp} disabled={!data.zona}>
              <option value="">Selecciona colonia</option>
              {colonias.map(c=><option key={c.id} value={c.id}>{c.n} ({c.min} min al campus)</option>)}
            </select>
          </div>
          <div><label style={lbl}>Precio mensual (MXN)</label><input type="number" value={data.precio||""} onChange={e=>set("precio",+e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Habitaciones disponibles</label><input type="number" min={1} value={data.habitaciones||""} onChange={e=>set("habitaciones",+e.target.value)} style={inp}/></div>
          <div>
            <label style={lbl}>Género de preferencia</label>
            <select value={data.genero||""} onChange={e=>set("genero",e.target.value)} style={inp}>
              <option value="">Mixto</option><option value="Femenino">Solo mujeres</option><option value="Masculino">Solo hombres</option>
            </select>
          </div>
          {isHogar&&<>
            <div><label style={lbl}>Distancia caminando al campus (min)</label><input type="number" value={data.dist_camina||""} onChange={e=>set("dist_camina",+e.target.value)} style={inp}/></div>
            <div><label style={lbl}>Distancia en transporte (min)</label><input type="number" value={data.dist_transporte||""} onChange={e=>set("dist_transporte",+e.target.value)} style={inp}/></div>
          </>}
        </div>
        {isHogar&&(data.dist_camina>10||data.dist_transporte>40)&&<div style={{marginTop:10,padding:"10px 14px",background:DS.warningLt,border:1px solid ${DS.warningBr},borderRadius:8,fontSize:12,color:DS.warning}}>⚠ Para Hogar IBERO: máx. 10 min caminando o 40 min en transporte.</div>}
      </div>
    );
    // 3 — Consentimientos con PDF descargable
    if(step===3)return(
      <div>
        <SH sm title="Consentimientos y acuerdos" sub="Lee cada documento antes de aceptar. Están disponibles en PDF para descarga."/>
        {[{k:"acepto_privacidad",titulo:"Aviso de privacidad — consentimiento para datos personales",resumen:"La Universidad Iberoamericana A.C. recabará tus datos para promover tu inmueble entre la comunidad universitaria conforme a la LFPDPPP. Tienes derecho de acceso, rectificación, cancelación y oposición contactando a la Oficina de Hospedaje.",pdfUrl:DOCS_PDF.aviso,accept:"Acepto el aviso de privacidad y el manejo de mis datos personales"},
          {k:"acepto_publicacion",titulo:Acuerdo de publicación — ${isHogar?"Hogar IBERO":"Proveedor de Servicios"},resumen:isHogar?"El anfitrión del Hogar IBERO acepta que la Universidad Iberoamericana A.C. actúa como intermediario, gestionando el contacto, contrato y pagos. Se compromete a proporcionar un ambiente seguro y respetar las condiciones acordadas con la institución.":"El responsable del inmueble entiende que la Oficina de Hospedaje actúa únicamente como enlace entre las partes, sin responsabilidad legal o económica. Se compromete a proporcionar información veraz y actualizada.",pdfUrl:DOCS_PDF.acuerdo,accept:"Acepto el acuerdo de publicación y sus términos y condiciones"}
        ].map(doc=>(
          <div key={doc.k} style={{...card,padding:"16px 18px",marginBottom:12,border:1.5px solid ${data[doc.k]?DS.successBr:DS.n200}}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:DS.n900,flex:1}}>{doc.titulo}</div>
              <a href={doc.pdfUrl} target="_blank" rel="noopener" style={{...btn("outline","xs"),textDecoration:"none",flexShrink:0,marginLeft:10}}>📄 Ver PDF</a>
            </div>
            <div style={{fontSize:11,color:DS.n600,lineHeight:1.75,marginBottom:12,padding:"10px 12px",background:DS.n50,borderRadius:7,maxHeight:100,overflowY:"auto"}}>{doc.resumen}</div>
            <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:12,fontWeight:600,color:DS.n900}}>
              <input type="checkbox" checked={!!data[doc.k]} onChange={e=>set(doc.k,e.target.checked)} style={{accentColor:DS.red500,width:15,height:15}}/>
              {doc.accept}
            </label>
            {data[doc.k]&&<div style={{fontSize:10,color:DS.success,marginTop:5}}>✓ Firmado digitalmente · {new Date().toLocaleDateString("es-MX")}</div>}
          </div>
        ))}
      </div>
    );
    // 4 — Fotos (mín 4)
    if(step===4)return<PhotoUploader photos={photos} setPhotos={setPhotos} minRequired={4}/>;
    // 5 — Información del anuncio
    if(step===5)return(
      <div>
        <SH sm title="Información del anuncio" sub="Esta información aparece en el directorio de la IBERO (equivale al anuncio en PDF que antes se enviaba por correo)."/>
        <div style={{display:"grid",gap:12}}>
          <div><label style={lbl}>¿Qué espacio se oferta?</label><input value={data.espacio_ofertado||""} onChange={e=>set("espacio_ofertado",e.target.value)} style={inp} placeholder="Ej. Habitación individual amueblada con baño compartido"/></div>
          <div>
            <label style={lbl}>Servicios incluidos</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {["WiFi","Comidas","Lavandería","Área de estudio","Gym","Seguridad 24h","Estacionamiento","Baño privado","Agua caliente","TV cable"].map(sv=>(
                <label key={sv} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:DS.n50,borderRadius:7,cursor:"pointer",fontSize:12}}>
                  <input type="checkbox" style={{accentColor:DS.red500}} checked={!!(data.servicios||[]).includes(sv)} onChange={e=>{const s=data.servicios||[];set("servicios",e.target.checked?[...s,sv]:s.filter(x=>x!==sv));}}/>
                  {sv}
                </label>
              ))}
            </div>
          </div>
          <div><label style={lbl}>Descripción del espacio</label><textarea rows={3} value={data.descripcion||""} onChange={e=>set("descripcion",e.target.value)} style={{...inp,resize:"vertical"}} placeholder="Ambiente, reglas de convivencia, distancia al campus..."/></div>
          {!isHogar&&<div><label style={lbl}>RFC del responsable</label>
            <input value={data.rfc||""} onChange={e=>{set("rfc",e.target.value.toUpperCase());setRfcErr(validarRFC(e.target.value));}} style={{...inp,border:1.5px solid ${rfcErr?DS.error:data.rfc&&!rfcErr?DS.success:DS.n200}}} placeholder="AAAA######AAA"/>
            {rfcErr&&<div style={{fontSize:11,color:DS.error,marginTop:3}}>{rfcErr}</div>}
            {data.rfc&&!rfcErr&&<div style={{fontSize:11,color:DS.success,marginTop:3}}>✓ RFC válido</div>}
          </div>}
        </div>
      </div>
    );
    // 6 — Pago (solo proveedor) o Resumen (hogar)
    if(step===6)return(
      <div>
        {!isHogar?<>
          <SH sm title="Pago de registro — $400 MXN" sub="Garantiza tu promoción en la base de datos IBERO por 2 años."/>
          <div style={{...card,padding:"16px 18px",marginBottom:14}}>
            <ol style={{fontSize:12,color:DS.n600,lineHeight:2.2,paddingLeft:18,margin:0}}>
              <li>Ingresa a <a href="https://enlinea.ibero.mx" target="_blank" rel="noopener" style={{color:DS.red500,fontWeight:600}}>enlinea.ibero.mx</a></li>
              <li>Selecciona "Oficina de Hospedaje — Registro de inmueble"</li>
              <li>Completa tus datos y realiza el pago de $400 MXN</li>
              <li>Ingresa aquí el número de referencia generado</li>
            </ol>
          </div>
          <div><label style={lbl}>Número de referencia del pago</label><input value={data.ref_pago||""} onChange={e=>set("ref_pago",e.target.value)} style={inp} placeholder="Ej. 2026-HOSP-00123"/></div>
        </>:<>
          <SH sm title="Resumen del registro — Hogar IBERO"/>
          {[["Nombre",data.nombre],["Zona","Zona "+(data.zona?ZONAS[data.zona]?.label:"—")],["Colonia",data.zona?ZONAS[data.zona]?.colonias.find(c=>c.id===data.colonia)?.n:"—"],["Precio","$"+(data.precio||0).toLocaleString()+" MXN/mes"],["Habitaciones",data.habitaciones||"—"],["Fotos cargadas",Object.values(photos).filter(p=>p?.url).length+"/mín. 4"]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:DS.n50,borderRadius:8,fontSize:12,marginBottom:6}}>
              <span style={{color:DS.n500}}>{l}</span><span style={{fontWeight:600,color:DS.n900}}>{v}</span>
            </div>
          ))}
        </>}
      </div>
    );
  };

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px"}}>
      <button onClick={onBack} style={{...btn("ghost","sm"),marginBottom:18}}>← Atrás</button>
      <SH eyebrow={tipo?${isHogar?"Hogar IBERO":"Proveedor"} — Paso ${step+1} de ${TOTAL}:"Nuevo registro"} title="Registro de anfitrión" sub="Tu información se guardará al finalizar todos los pasos."/>
      <div style={{display:"flex",gap:3,marginBottom:24}}>{Array.from({length:TOTAL}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?DS.red500:DS.n100}}/>)}</div>
      {renderStep()}
      <div style={{display:"flex",gap:9,marginTop:22}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{...btn("ghost","md"),flex:1}}>← Anterior</button>}
        {step<TOTAL-1?(
          <button onClick={nextStep} style={{...btn(canNext()?"primary":"ghost","md"),flex:2,justifyContent:"center",opacity:canNext()?1:0.45}}>
            {!canNext()&&step===4?Necesitas ${4-Object.values(photos).filter(p=>p?.url).length} fotos más:"Continuar →"}
          </button>
        ):(
          <button onClick={()=>onSave({...data,tipo:tipo,status:"pending",created:new Date().toISOString()})} style={{...btn("success","md"),flex:2,justifyContent:"center"}}>💾 Guardar y enviar a revisión</button>
        )}
      </div>
    </div>
  );
}

function ProvInicio({profile,docs,photos}) {
  const isHogar=profile?.tipo==="hogar_ibero";
  const docsList=DOCS_PROV.filter(d=>isHogar?!d.soloProveedor:true);
  const done=docsList.filter(d=>docs[d.id]).length;
  const fotosOk=Object.values(photos).filter(p=>p?.url).length;
  const alumno={nombre:"Renata Olivares",carrera:"Comunicación",sem:"5°",inicio:"Feb 2026",fin:"Jul 2026",wa:"5512345678",email:"renata.olivares@ibero.mx"};
  return (
    <div style={{padding:"28px 32px"}}>
      <SH eyebrow={isHogar?"Hogar IBERO":"Proveedor de Servicios"} title={Hola, ${profile?.nombre||"Anfitrión"}} sub={new Date().toLocaleDateString("es-MX",{dateStyle:"long"})}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:22}}>
        {[["Estado",profile?.status==="published"?"Publicado":"En revisión",profile?.status==="published"?DS.success:DS.warning],["Documentos",${done}/${docsList.length},done===docsList.length?DS.success:DS.warning],["Fotos",${fotosOk}/mín. 4,fotosOk>=4?DS.success:DS.warning],["Calificación",isHogar?"4.8 ★":"—",DS.warning]].map(([l,v,c])=>(
          <div key={l} style={{...card,padding:"14px 16px"}}><div style={{fontSize:9,color:DS.n500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div></div>
        ))}
      </div>
      {isHogar&&<div style={{...card,padding:"18px 20px",marginBottom:18,border:1px solid ${DS.successBr}}}>
        <div style={{fontSize:11,fontWeight:700,color:DS.success,marginBottom:10}}>👤 ALUMNO ACTIVO EN TU HOGAR</div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:DS.red50,border:2px solid ${DS.red200},display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:DS.red500,flexShrink:0}}>RO</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:DS.n900}}>{alumno.nombre}</div><div style={{fontSize:11,color:DS.n500}}>{alumno.carrera} · {alumno.sem} semestre</div><div style={{fontSize:11,color:DS.n500}}>Estancia: {alumno.inicio} – {alumno.fin}</div></div>
          <div style={{display:"flex",gap:7}}>
            <a href={https://wa.me/52${alumno.wa}} target="_blank" rel="noopener" style={{...btn("success","sm"),textDecoration:"none"}}>WhatsApp</a>
            <a href={mailto:${alumno.email}} style={{...btn("ghost","sm"),textDecoration:"none"}}>Correo</a>
          </div>
        </div>
      </div>}
      <div style={{...card,padding:"16px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:DS.n900,marginBottom:10}}>Contacto — Oficina de Hospedaje IBERO</div>
        {[["📧","aranza.garcia@ibero.mx"],["📞","55 5950-4000, ext. 4018"],["📍","Edificio E, Planta Baja · L–V 9–17h"]].map(([i,t])=>(
          <div key={t} style={{display:"flex",gap:8,padding:"5px 0",fontSize:12,color:DS.n600}}><span>{i}</span>{t}</div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPEDIENTE HUB (click para abrir detalle) ────────────────────────────
function ProvExpedienteHub({profile,docs,onUpload,photos,setPhotos,notify}) {
  const [selected,setSelected]=useState(null); // null | "docs" | "fotos" | docId
  const isHogar=profile?.tipo==="hogar_ibero";
  const docsList=DOCS_PROV.filter(d=>isHogar?!d.soloProveedor:true);
  const done=docsList.filter(d=>docs[d.id]).length;
  const fotosOk=Object.values(photos).filter(p=>p?.url).length;
  const sections=[
    {id:"docs",label:"Documentos oficiales",desc:${done}/${docsList.length} cargados,status:done===docsList.length?"approved":"pending",icon:"📋"},
    {id:"fotos",label:"Fotografías del inmueble",desc:${fotosOk} fotos cargadas (mín. 4),status:fotosOk>=4?"approved":"pending",icon:"📸"},
    ...docsList.map(d=>({id:d.id,label:d.nombre,desc:d.desc,status:docs[d.id]?"complete":"pending",icon:"📄",doc:d})),
  ];
  if(selected==="docs"||selected==="fotos"||docsList.find(d=>d.id===selected)) {
    const sec=sections.find(s=>s.id===selected);
    return(
      <div style={{padding:"28px 32px"}}>
        <button onClick={()=>setSelected(null)} style={{...btn("ghost","sm"),marginBottom:18}}>← Regresar al expediente</button>
        {selected==="fotos"?<>
          <SH sm title="Fotografías del inmueble" sub="Mínimo 4 fotos requeridas. Puedes agregar fotos con nombre propio."/>
          <PhotoUploader photos={photos} setPhotos={async(p)=>{await setPhotos(p);notify("Foto actualizada");}} minRequired={4}/>
        </>:selected==="docs"?<>
          <SH sm title="Documentos oficiales" sub="Sube todos los documentos para activar tu perfil."/>
          <div style={{display:"grid",gap:10}}>
            {docsList.map(doc=>(
              <div key={doc.id} style={{...card,padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div><div style={{fontSize:13,fontWeight:700,color:DS.n900,marginBottom:2}}>{doc.nombre}</div><div style={{fontSize:11,color:DS.n500}}>{doc.desc}</div></div>
                  <StatusBadge st={docs[doc.id]?"complete":"pending"}/>
                </div>
                {doc.tipo==="ine"?<IneUploader docId={doc.id} current={docs[doc.id]||null} onUpload={async(id,fn)=>{await onUpload(id,fn);}}/>
                :<FileUploader docId={doc.id} accept={doc.accept} current={docs[doc.id]||null} onUpload={async(id,fn)=>{await onUpload(id,fn);}}/>}
                {doc.pdfUrl&&<a href={doc.pdfUrl} target="_blank" rel="noopener" style={{...btn("outline","xs"),textDecoration:"none",marginTop:8,display:"inline-flex"}}>📄 Ver documento PDF</a>}
              </div>
            ))}
          </div>
        </>:<>
          <SH sm title={sec?.label} sub={sec?.desc}/>
          {sec?.doc&&(sec.doc.tipo==="ine"?<IneUploader docId={sec.doc.id} current={docs[sec.doc.id]||null} onUpload={onUpload}/>:<FileUploader docId={sec.doc.id} accept={sec.doc.accept} current={docs[sec.doc.id]||null} onUpload={onUpload}/>)}
        </>}
      </div>
    );
  }
  return(
    <div style={{padding:"28px 32px"}}>
      <SH eyebrow="Expediente" title="Mi expediente" sub="Haz clic en cualquier sección para ver el detalle y cargar archivos"/>
      <div style={{...card,padding:"14px 18px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:700,color:DS.n900}}>Progreso general</span>
          <span style={{fontSize:12,color:done===docsList.length&&fotosOk>=4?DS.success:DS.warning,fontWeight:700}}>{done+Math.min(fotosOk,1)}/{docsList.length+1}</span>
        </div>
        <div style={{height:6,background:DS.n100,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:${Math.round(((done+Math.min(fotosOk,1))/(docsList.length+1))*100)}%,background:DS.red500,borderRadius:3,transition:"width 0.5s"}}/></div>
      </div>
      <div style={{display:"grid",gap:10}}>
        {[{id:"docs",label:"📋 Documentos oficiales",desc:${done}/${docsList.length} cargados,status:done===docsList.length?"approved":"pending"},{id:"fotos",label:"📸 Fotografías del inmueble",desc:${fotosOk} fotos cargadas (mínimo 4),status:fotosOk>=4?"approved":"pending"}].map(sec=>(
          <div key={sec.id} onClick={()=>setSelected(sec.id)} style={{...card,padding:"16px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=DS.red200;e.currentTarget.style.boxShadow=DS.sh2;}} onMouseOut={e=>{e.currentTarget.style.borderColor=DS.n100;e.currentTarget.style.boxShadow=DS.sh1;}}>
            <div><div style={{fontSize:14,fontWeight:700,color:DS.n900,marginBottom:2}}>{sec.label}</div><div style={{fontSize:11,color:DS.n500}}>{sec.desc}</div></div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><StatusBadge st={sec.status}/><span style={{color:DS.n300,fontSize:18}}>›</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProvAnuncio({profile,onSave}) {
  const [editing,setEditing]=useState(false);
  const [data,setData]=useState({nombre:profile?.nombre,precio:profile?.precio,descripcion:profile?.descripcion,servicios:profile?.servicios||[]});
  const set=(k,v)=>setData(d=>({...d,[k]:v}));
  return(
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <SH eyebrow="Mi Anuncio" title="Perfil en el directorio" sub="Así te verán los estudiantes en el catálogo"/>
        <button onClick={()=>{if(editing)onSave(data);setEditing(!editing);}} style={btn(editing?"primary":"outline","md")}>{editing?"💾 Guardar":"✏️ Editar"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        {[["Nombre / razón social","nombre"],["Precio mensual (MXN)","precio"]].map(([l,k])=>(
          <div key={k} style={{...card,padding:"13px 15px"}}><div style={{fontSize:9,color:DS.n500,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
            {editing?<input value={data[k]||""} onChange={e=>set(k,e.target.value)} style={inp}/>:<div style={{fontSize:14,fontWeight:700,color:DS.n900}}>{data[k]||"—"}</div>}
          </div>
        ))}
        <div style={{...card,padding:"13px 15px"}}><div style={{fontSize:9,color:DS.n500,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>Zona · Colonia</div><div style={{fontSize:13,fontWeight:600,color:DS.n900}}>Zona {profile?.zona?ZONAS[profile.zona]?.label:"—"}</div></div>
        <div style={{...card,padding:"13px 15px"}}><div style={{fontSize:9,color:DS.n500,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tipo</div><div style={{fontSize:13,fontWeight:600,color:DS.n900}}>{profile?.tipo==="hogar_ibero"?"Hogar IBERO":"Proveedor"}</div></div>
      </div>
      <div style={{...card,padding:"16px 18px",marginBottom:12}}><div style={{fontSize:9,color:DS.n500,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Descripción</div>
        {editing?<textarea rows={3} value={data.descripcion||""} onChange={e=>set("descripcion",e.target.value)} style={{...inp,resize:"vertical"}}/>:<p style={{fontSize:13,color:DS.n600,margin:0,lineHeight:1.7}}>{data.descripcion||"—"}</p>}
      </div>
      <div style={{...card,padding:"16px 18px"}}><div style={{fontSize:9,color:DS.n500,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Servicios incluidos</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{(data.servicios||[]).map(s=><span key={s} style={{fontSize:11,background:DS.n50,border:1px solid ${DS.n200},color:DS.n700,padding:"3px 9px",borderRadius:20}}>{s}</span>)}</div>
      </div>
    </div>
  );
}

function ProvEncuestas() {
  const enc=[{alumno:"Renata Olivares",sem:"Feb–Jul 2026",limpieza:5,ambiente:5,comunicacion:4,ubicacion:4,general:4.8,comentario:"Familia increíble, me sentí como en casa. El desayuno es delicioso."},
    {alumno:"Lucía Moreno",sem:"Ago–Dic 2025",limpieza:4,ambiente:5,comunicacion:5,ubicacion:4,general:4.7,comentario:"Excelente ubicación y muy buena comunicación. La señora siempre pendiente."}];
  const prom=(cat)=>(enc.reduce((a,e)=>a+e[cat],0)/enc.length).toFixed(1);
  return(
    <div style={{padding:"28px 32px"}}>
      <SH eyebrow="Encuestas" title="Resultados de satisfacción" sub="Opiniones recolectadas de alumnos que han vivido en tu hogar"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:22}}>
        {[["Limpieza","limpieza"],["Ambiente","ambiente"],["Comunicación","comunicacion"],["Ubicación","ubicacion"],["General","general"]].map(([l,k])=>(
          <div key={l} style={{...card,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:10,color:DS.n500,marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:900,color:+prom(k)>=4.5?DS.success:DS.warning}}>{prom(k)} ★</div></div>
        ))}
      </div>
      {enc.map((e,i)=>(
        <div key={i} style={{...card,padding:"18px 20px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div><div style={{fontSize:13,fontWeight:700,color:DS.n900}}>{e.alumno}</div><div style={{fontSize:11,color:DS.n500}}>Estancia: {e.sem}</div></div>
            <Stars r={e.general} sz={14}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
            {[["Limpieza",e.limpieza],["Ambiente",e.ambiente],["Comunicación",e.comunicacion],["Ubicación",e.ubicacion]].map(([l,v])=>(
              <div key={l} style={{background:DS.n50,borderRadius:7,padding:"7px",textAlign:"center"}}><div style={{fontSize:9,color:DS.n500,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontWeight:700,color:v>=4.5?DS.success:DS.warning}}>{v}★</div></div>
            ))}
          </div>
          <p style={{fontSize:12,color:DS.n600,margin:0,fontStyle:"italic",lineHeight:1.7}}>"{e.comentario}"</p>
        </div>
      ))}
    </div>
  );
}

function ProvFacturas({profile,notify}) {
  const isHogar=profile?.tipo==="hogar_ibero";
  const [rfcModal,setRfcModal]=useState(null);
  const [rfcData,setRfcData]=useState({rfc:"",factura:"",monto:""});
  const [rfcErr,setRfcErr]=useState(null);
  const [ejemploModal,setEjemploModal]=useState(false);
  const facturas=isHogar?[
    {id:"F-001",alumno:"Lucía Moreno",periodo:"Ago–Dic 2025",monto:27500,status:"paid",rfc:"LOGM9503124V2",obs:"RFC válido · Monto correcto · CFDI sellado"},
    {id:"F-002",alumno:"Renata Olivares",periodo:"Feb–Jul 2026",monto:33000,status:"inprogress",obs:"Pendiente de subir factura"},
  ]:[{id:"REG-001",concepto:"Registro inmueble 2026–2028",monto:400,status:"paid",fecha:"12 ene 2026"}];
  return(
    <div style={{padding:"28px 32px"}}>
      {ejemploModal&&<Modal title="Ejemplo de factura CFDI — Datos requeridos" sub="Todos los campos marcados son obligatorios para la validación" onClose={()=>setEjemploModal(false)} wide>
        <div style={{...card,padding:"20px 24px",border:2px solid ${DS.red200},marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[["RFC Emisor","Tu RFC (AAAA######AAA)",true],["Razón social emisor","Tu nombre o razón social",true],["RFC Receptor","UIAA610818HD2 (IBERO A.C.)",true],["Razón social receptor","Universidad Iberoamericana A.C.",true],["CFDI sellado por SAT","Sí — con timbre fiscal digital",true],["Concepto","Servicio de hospedaje estudiantil",true],["Monto","Igual al contrato mensual x meses",true],["Periodo","Fecha de inicio y fin de la estancia",true],["Método de pago","PPD o PUE según corresponda",false],["Uso CFDI","D10 - Pagos por servicios educativos",false]].map(([l,v,req])=>(
              <div key={l} style={{padding:"10px 12px",background:req?DS.red50:DS.n50,borderRadius:8,border:1px solid ${req?DS.red200:DS.n200}}}>
                <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}><div style={{fontSize:10,color:req?DS.red500:DS.n500,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>{req&&<span style={{fontSize:9,background:DS.red500,color:"white",padding:"1px 5px",borderRadius:4}}>OBLIGATORIO</span>}</div>
                <div style={{fontSize:12,color:DS.n700}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"12px 16px",background:DS.warningLt,border:1px solid ${DS.warningBr},borderRadius:8,fontSize:12,color:DS.warning}}>⚠ Si algún dato no coincide con tu expediente o el monto no corresponde al periodo, la factura será rechazada automáticamente y recibirás notificación.</div>
      </Modal>}
      {rfcModal&&<Modal title="Subir factura CFDI" sub={${rfcModal.alumno} · ${rfcModal.periodo}} onClose={()=>setRfcModal(null)}>
        <div style={{display:"grid",gap:12}}>
          <div><label style={lbl}>RFC del emisor</label>
            <input value={rfcData.rfc} onChange={e=>{setRfcData(d=>({...d,rfc:e.target.value.toUpperCase()}));setRfcErr(validarRFC(e.target.value));}} style={{...inp,border:1.5px solid ${rfcErr?DS.error:rfcData.rfc&&!rfcErr?DS.success:DS.n200}}} placeholder="AAAA######AAA"/>
            {rfcErr&&<div style={{fontSize:11,color:DS.error,marginTop:3}}>{rfcErr}</div>}
            {rfcData.rfc&&!rfcErr&&<div style={{fontSize:11,color:DS.success,marginTop:3}}>✓ RFC válido</div>}
          </div>
          <div><label style={lbl}>Monto facturado (MXN)</label><input type="number" value={rfcData.monto} onChange={e=>setRfcData(d=>({...d,monto:e.target.value}))} style={inp} placeholder={rfcModal.monto}/></div>
          <div><label style={lbl}>Archivo XML o PDF del CFDI</label><FileUploader docId="cfdi" accept=".xml,.pdf" current={rfcData.factura||null} onUpload={(id,fn)=>setRfcData(d=>({...d,factura:fn}))}/></div>
        </div>
        <div style={{display:"flex",gap:9,marginTop:16}}>
          <button onClick={()=>setRfcModal(null)} style={{...btn("ghost","md"),flex:1}}>Cancelar</button>
          <button onClick={()=>{if(rfcErr||!rfcData.rfc||!rfcData.factura){notify("Completa todos los campos","warning");return;}notify("Factura enviada a validación ✓");setRfcModal(null);}} style={{...btn("primary","md"),flex:2,justifyContent:"center"}}>Enviar →</button>
        </div>
      </Modal>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <SH eyebrow="Facturas" title={isHogar?"Facturas mensuales":"Pago de registro"} sub={isHogar?"Facturas que la IBERO procesa a tu favor":"Historial de tu pago de registro"}/>
        {isHogar&&<button onClick={()=>setEjemploModal(true)} style={btn("outline","sm")}>📄 Ver ejemplo de factura</button>}
      </div>
      <div style={{display:"grid",gap:12}}>
        {facturas.map(f=>(
          <div key={f.id} style={{...card,padding:"16px 18px",border:1px solid ${f.status==="paid"?DS.successBr:DS.n200}}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><div style={{fontSize:13,fontWeight:700,color:DS.n900}}>{isHogar?f.alumno:f.concepto}</div><div style={{fontSize:11,color:DS.n500}}>{isHogar?f.periodo:f.fecha}{f.rfc&& · RFC: ${f.rfc}}</div>{f.obs&&<div style={{fontSize:10,color:f.status==="paid"?DS.success:DS.n400,marginTop:3}}>{f.obs}</div>}</div>
              <div style={{textAlign:"right"}}><div style={{fontSize:17,fontWeight:800,color:DS.n900,marginBottom:4}}>${f.monto.toLocaleString()} MXN</div><StatusBadge st={f.status}/></div>
            </div>
            {isHogar&&f.status==="inprogress"&&<button onClick={()=>setRfcModal(f)} style={{...btn("primary","sm"),marginTop:10}}>Subir factura CFDI</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── ESTUDIANTE APP ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

function EstudianteApp({back}) {
  const [page,setPage]=useState("home");
  const [modalidad,setModalidad]=useState(null); // null | "hogar_ibero" | "catalogo"
  const [initZona,setInitZona]=useState(null);
  const [guardados,setGuardados]=useState([]);
  const [toast,setToast]=useState(null);
  const [encuesta,setEncuesta]=useState(false);
  const go=(p,z=null,m=null)=>{setPage(p);if(z)setInitZona(z);if(m)setModalidad(m);try{window.scrollTo(0,0);}catch{}};
  const notify=(msg,type="success")=>setToast({msg,type});
  const NAV=[{id:"home",l:"Inicio"},{id:"catalogo",l:"Catálogo"},{id:"buddy",l:"Buddy Finder"},{id:"mystay",l:"Mi estancia"}];
  return(
    <div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {encuesta&&<EncuestaModal onClose={()=>{setEncuesta(false);notify("¡Gracias por tu encuesta!");}}/>}
      <div style={{borderBottom:1px solid ${DS.n100},padding:"0 24px",height:46,display:"flex",alignItems:"center",gap:3,background:DS.white}}>
        {NAV.map(n=><button key={n.id} onClick={()=>go(n.id)} style={{background:page===n.id?DS.red50:"transparent",border:"none",color:page===n.id?DS.red500:DS.n600,borderRadius:7,padding:"6px 12px",fontSize:13,cursor:"pointer",fontWeight:page===n.id?700:400}}>{n.l}</button>)}
        <div style={{marginLeft:"auto",display:"flex",gap:7}}>
          <button onClick={()=>setEncuesta(true)} style={{...btn("outline","sm"),fontSize:11}}>⭐ Evalúa tu estancia</button>
          <button onClick={back} style={{...btn("ghost","sm"),fontSize:11}}>Salir</button>
        </div>
      </div>
      {page==="home"&&<EstHome go={go}/>}
      {page==="catalogo"&&<Catalogo initZona={initZona} initModalidad={modalidad} guardados={guardados} toggleGuardado={(id)=>setGuardados(g=>g.includes(id)?g.filter(x=>x!==id):[...g,id])} notify={notify}/>}
      {page==="buddy"&&<BuddyFinder notify={notify}/>}
      {page==="mystay"&&<MiEstancia/>}
    </div>
  );
}

function EncuestaModal({onClose}) {
  const [vals,setVals]=useState({});
  const [comentario,setComentario]=useState("");
  const items=["Limpieza del espacio","Ambiente del hogar","Comunicación con el anfitrión","Ubicación y acceso al campus","Servicios incluidos"];
  return(
    <Modal title="Evalúa tu estancia" sub="Tu opinión ayuda a otros estudiantes y a mejorar el servicio" onClose={onClose}>
      {items.map(item=>(
        <div key={item} style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:DS.n900,marginBottom:6}}>{item}</div>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>setVals(v=>({...v,[item]:n}))} style={{width:36,height:36,borderRadius:8,border:1.5px solid ${vals[item]>=n?DS.warning:DS.n200},background:vals[item]>=n?DS.warningLt:"transparent",color:vals[item]>=n?"#F59E0B":DS.n400,fontSize:16,cursor:"pointer",fontWeight:700}}>★</button>
            ))}
          </div>
        </div>
      ))}
      <div style={{marginBottom:14}}><label style={lbl}>Comentarios</label><textarea rows={3} value={comentario} onChange={e=>setComentario(e.target.value)} style={{...inp,resize:"vertical"}} placeholder="Comparte tu experiencia..."/></div>
      <div style={{display:"flex",gap:9}}>
        <button onClick={onClose} style={{...btn("ghost","md"),flex:1}}>Cancelar</button>
        <button onClick={onClose} style={{...btn("primary","md"),flex:2,justifyContent:"center"}}>Enviar encuesta →</button>
      </div>
    </Modal>
  );
}

function EstHome({go}) {
  return(
    <div>
      <div style={{background:DS.red500,padding:"52px 24px 60px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1400&q=50)",backgroundSize:"cover",backgroundPosition:"center",opacity:0.08}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:600,margin:"0 auto"}}>
          <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:900,color:"white",lineHeight:1.08,margin:"0 0 12px"}}>Encuentra tu hogar<br/>en la Ciudad de México</h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.82)",marginBottom:28,lineHeight:1.7}}>Hospedajes verificados por la Oficina de Hospedaje IBERO en las 4 zonas de CDMX.</p>
          {/* SELECTOR DE MODALIDAD */}
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
            <button onClick={()=>go("catalogo",null,"hogar_ibero")} style={{background:"white",color:DS.red500,border:"none",borderRadius:10,padding:"11px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>🏡 Hogares IBERO</button>
            <button onClick={()=>go("catalogo",null,"catalogo")} style={{background:"rgba(255,255,255,0.18)",color:"white",border:"1.5px solid rgba(255,255,255,0.5)",borderRadius:10,padding:"11px 20px",fontSize:13,cursor:"pointer",fontWeight:600}}>📋 Catálogo de Hospedaje</button>
          </div>
          <button onClick={()=>go("catalogo")} style={{background:"transparent",color:"rgba(255,255,255,0.7)",border:"none",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Ver todos →</button>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 24px 56px"}}>
        {/* INFO MODALIDADES */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:36}}>
          {[{id:"hogar_ibero",emoji:"🏡",titulo:"Hogar IBERO",desc:"Familias verificadas por la IBERO. La institución gestiona el contacto, contrato y pagos. Mayor seguridad institucional.",color:DS.red500,badge:"IBERO intermediario"},
            {id:"catalogo",emoji:"📋",titulo:"Catálogo de Hospedaje",desc:"Residencias, departamentos y habitaciones en el directorio de la Oficina de Hospedaje. La IBERO actúa como enlace entre las partes.",color:DS.n700,badge:"Contacto directo"}].map(m=>(
            <div key={m.id} onClick={()=>go("catalogo",null,m.id)} style={{...card,padding:"20px 18px",cursor:"pointer",border:1.5px solid ${DS.n100},transition:"all 0.2s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=m.color;e.currentTarget.style.boxShadow=DS.sh2;}} onMouseOut={e=>{e.currentTarget.style.borderColor=DS.n100;e.currentTarget.style.boxShadow=DS.sh1;}}>
              <div style={{fontSize:26,marginBottom:8}}>{m.emoji}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{fontSize:15,fontWeight:800,color:DS.n900}}>{m.titulo}</div>
                <span style={{fontSize:9,background:m.color,color:"white",padding:"2px 7px",borderRadius:10}}>{m.badge}</span>
              </div>
              <div style={{fontSize:12,color:DS.n500,lineHeight:1.7,marginBottom:10}}>{m.desc}</div>
              <div style={{fontSize:11,color:m.color,fontWeight:700}}>{HOSPEDAJES.filter(h=>h.modalidad===m.id).length} opciones disponibles →</div>
            </div>
          ))}
        </div>
        <SH eyebrow="Explorar por zona" title="4 zonas de CDMX" sub="Selecciona la que mejor se adapte a tu estilo y presupuesto"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginBottom:44}}>
          {Object.entries(ZONAS).map(([id,z])=>(
            <div key={id} onClick={()=>go("catalogo",id)} style={{...card,padding:"18px 16px",cursor:"pointer",transition:"all 0.2s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=z.color;e.currentTarget.style.boxShadow=DS.sh2;}} onMouseOut={e=>{e.currentTarget.style.borderColor=DS.n100;e.currentTarget.style.boxShadow=DS.sh1;}}>
              <div style={{fontSize:24,marginBottom:7}}>{z.emoji}</div>
              <div style={{fontSize:15,fontWeight:800,color:DS.n900,marginBottom:3}}>Zona {z.label}</div>
              <div style={{fontSize:11,color:DS.n500,marginBottom:10,lineHeight:1.6}}>{z.desc}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{z.colonias.slice(0,3).map(c=><span key={c.id} style={{fontSize:10,background:${z.color}12,border:1px solid ${z.color}30,color:z.color,padding:"2px 7px",borderRadius:6,fontWeight:600}}>{c.n}</span>)}</div>
              <div style={{fontSize:11,color:z.color,fontWeight:700}}>{HOSPEDAJES.filter(h=>h.zona===id&&h.disponible).length} hospedajes →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Catalogo({initZona,initModalidad,guardados,toggleGuardado,notify}) {
  const [zona,setZona]=useState(initZona||"all");
  const [colonia,setColonia]=useState("all");
  const [modalidad,setModalidad]=useState(initModalidad||"all");
  const [tipo,setTipo]=useState("all");
  const [maxP,setMaxP]=useState(10000);
  const [genero,setGenero]=useState("all");
  const [soloDispo,setSoloDispo]=useState(true);
  const [modalH,setModalH]=useState(null);
  const colonias=zona!=="all"?ZONAS[zona]?.colonias||[]:[];
  const filtered=HOSPEDAJES
    .filter(h=>zona==="all"||h.zona===zona).filter(h=>colonia==="all"||h.colonia===colonia)
    .filter(h=>modalidad==="all"||h.modalidad===modalidad)
    .filter(h=>tipo==="all"||h.tipo===tipo).filter(h=>h.precio<=maxP)
    .filter(h=>genero==="all"||h.genero===genero||h.genero==="Mixto")
    .filter(h=>!soloDispo||h.disponible);
  const tipoLabel={hogar_ibero:"Hogar IBERO",residencia:"Residencia",departamento:"Departamento",habitacion:"Habitación"};
  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 24px"}}>
      {modalH&&<DetalleModal h={modalH} onClose={()=>setModalH(null)} guardado={guardados.includes(modalH.id)} toggleGuardado={toggleGuardado} notify={notify}/>}
      <SH eyebrow="Catálogo" title="Hospedajes IBERO en CDMX" sub={${filtered.length} opciones · Directorio oficial Oficina de Hospedaje}/>
      {/* MODALIDAD SELECTOR */}
      <div style={{display:"flex",gap:7,marginBottom:12}}>
        {[["all","Todas las modalidades","🏙️"],[" hogar_ibero","Hogares IBERO","🏡"],["catalogo","Catálogo de Hospedaje","📋"]].map(([v,l,e])=>(
          <button key={v} onClick={()=>setModalidad(v.trim())} style={{background:modalidad===v.trim()?DS.red500:"white",border:1.5px solid ${modalidad===v.trim()?DS.red500:DS.n200},color:modalidad===v.trim()?"white":DS.n600,borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer",fontWeight:modalidad===v.trim()?700:400}}>
            {e} {l}
          </button>
        ))}
      </div>
      {/* ZONA */}
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4,marginBottom:10,scrollbarWidth:"none"}}>
        {[{id:"all",label:"Todas",emoji:"🏙️"},...Object.entries(ZONAS).map(([id,z])=>({id,label:z.label,emoji:z.emoji,color:z.color}))].map(z=>(
          <button key={z.id} onClick={()=>{setZona(z.id);setColonia("all");}} style={{flexShrink:0,background:zona===z.id?DS.red500:"white",border:1.5px solid ${zona===z.id?DS.red500:DS.n200},color:zona===z.id?"white":DS.n600,borderRadius:20,padding:"5px 14px",fontSize:11,cursor:"pointer",fontWeight:zona===z.id?700:400}}>
            {z.emoji} {z.label||"Todas"}
          </button>
        ))}
      </div>
      {colonias.length>0&&<div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4,marginBottom:10,scrollbarWidth:"none"}}>
        <button onClick={()=>setColonia("all")} style={{flexShrink:0,background:colonia==="all"?DS.red50:"white",border:1.5px solid ${colonia==="all"?DS.red500:DS.n200},color:colonia==="all"?DS.red500:DS.n500,borderRadius:20,padding:"4px 12px",fontSize:11,cursor:"pointer"}}>Todas</button>
        {colonias.map(c=><button key={c.id} onClick={()=>setColonia(c.id)} style={{flexShrink:0,background:colonia===c.id?DS.red50:"white",border:1.5px solid ${colonia===c.id?DS.red500:DS.n200},color:colonia===c.id?DS.red500:DS.n500,borderRadius:20,padding:"4px 12px",fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{c.n} {c.min}min</button>)}
      </div>}
      {/* FILTROS */}
      <div style={{...card,padding:"11px 14px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
        {[["Tipo",tipo,setTipo,[["all","Todos tipos"],["hogar_ibero","Hogar IBERO"],["residencia","Residencia"],["departamento","Departamento"],["habitacion","Habitación"]]],["Género",genero,setGenero,[["all","Sin filtro"],["Femenino","Solo mujeres"],["Masculino","Solo hombres"]]]].map(([l,v,fn,opts])=>(
          <div key={l} style={{flex:"1 1 130px"}}><label style={lbl}>{l}</label><select value={v} onChange={e=>fn(e.target.value)} style={inp}>{opts.map(([vl,lb])=><option key={vl} value={vl}>{lb}</option>)}</select></div>
        ))}
        <div style={{flex:"1 1 160px"}}><label style={lbl}>Precio máx: <strong>${maxP.toLocaleString()}</strong></label><input type="range" min={2000} max={12000} step={500} value={maxP} onChange={e=>setMaxP(+e.target.value)} style={{width:"100%",accentColor:DS.red500}}/></div>
        <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><input type="checkbox" checked={soloDispo} onChange={()=>setSoloDispo(!soloDispo)} style={{accentColor:DS.red500,width:13,height:13}}/><span style={{fontSize:12,color:DS.n600}}>Solo disponibles</span></label>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
        {filtered.map(h=>(
          <div key={h.id} onClick={()=>setModalH(h)} style={{...card,cursor:"pointer",overflow:"hidden",transition:"all 0.2s"}}
            onMouseOver={e=>{e.currentTarget.style.boxShadow=DS.sh3;e.currentTarget.style.transform="translateY(-2px)";}} onMouseOut={e=>{e.currentTarget.style.boxShadow=DS.sh1;e.currentTarget.style.transform="none";}}>
            <div style={{position:"relative",height:168,overflow:"hidden"}}>
              <img src={h.foto} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {h.verificado&&<div style={{position:"absolute",top:8,left:8,background:"white",border:1px solid ${DS.successBr},color:DS.success,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20}}>✓ Verificado</div>}
              <button onClick={e=>{e.stopPropagation();toggleGuardado(h.id);}} style={{position:"absolute",top:7,right:7,background:"white",border:1px solid ${DS.n200},borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",color:guardados.includes(h.id)?DS.red500:DS.n400}}>{guardados.includes(h.id)?"♥":"♡"}</button>
              <div style={{position:"absolute",bottom:8,left:8}}>
                <span style={{background:h.modalidad==="hogar_ibero"?DS.red500:DS.n700,color:"white",fontSize:9,fontWeight:700,padding:"2px 9px",borderRadius:20,marginRight:4}}>{h.modalidad==="hogar_ibero"?"Hogar IBERO":"Catálogo"}</span>
                <span style={{background:"rgba(255,255,255,0.9)",color:DS.n700,fontSize:9,padding:"2px 7px",borderRadius:20}}>{tipoLabel[h.tipo]||h.tipo}</span>
              </div>
            </div>
            <div style={{padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div><div style={{fontSize:13,fontWeight:700,color:DS.n900}}>{h.nombre}</div><div style={{fontSize:10,color:DS.n400}}>Zona {ZONAS[h.zona]?.label} · {ZONAS[h.zona]?.colonias.find(c=>c.id===h.colonia)?.n}</div></div>
                <Stars r={h.rating} n={h.reviews}/>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>{h.amenidades.slice(0,3).map(a=><span key={a} style={{fontSize:9,background:DS.n50,border:1px solid ${DS.n200},color:DS.n600,padding:"1px 7px",borderRadius:20}}>{a}</span>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontSize:17,fontWeight:800,color:DS.n900}}>${h.precio.toLocaleString()}</span><span style={{fontSize:10,color:DS.n400}}>/mes</span></div>
                <span style={{fontSize:10,color:DS.red500,fontWeight:600}}>{ZONAS[h.zona]?.colonias.find(c=>c.id===h.colonia)?.min||"?"} min campus</span>
              </div>
            </div>
          </div>
        ))}
        {!filtered.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px 0",color:DS.n400}}>Sin resultados. Ajusta los filtros.</div>}
      </div>
    </div>
  );
}

function DetalleModal({h,onClose,guardado,toggleGuardado,notify}) {
  const [tab,setTab]=useState("info");
  const [showBook,setShowBook]=useState(false);
  const [step,setStep]=useState(1);
  const z=ZONAS[h.zona]; const col=z?.colonias.find(c=>c.id===h.colonia);
  const tipoLabel={hogar_ibero:"Hogar IBERO",residencia:"Residencia",departamento:"Departamento",habitacion:"Habitación"};
  return(
    <Modal title={h.nombre} sub={${tipoLabel[h.tipo]||h.tipo} · ${col?.n}, Zona ${z?.label}} onClose={onClose} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
        <div>
          <img src={h.foto} style={{width:"100%",height:180,objectFit:"cover",borderRadius:10,marginBottom:12}}/>
          <div style={{display:"flex",gap:5,marginBottom:12}}>
            {["info","amenidades","reseñas"].map(t=><button key={t} onClick={()=>setTab(t)} style={{background:tab===t?DS.red50:"transparent",border:1.5px solid ${tab===t?DS.red500:DS.n200},color:tab===t?DS.red500:DS.n600,borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer",fontWeight:tab===t?700:400,textTransform:"capitalize"}}>{t}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <span style={{fontSize:10,background:h.modalidad==="hogar_ibero"?DS.red500:DS.n700,color:"white",padding:"3px 10px",borderRadius:20,fontWeight:700}}>{h.modalidad==="hogar_ibero"?"🏡 Hogar IBERO":"📋 Catálogo"}</span>
            {h.verificado&&<span style={{fontSize:10,background:DS.successLt,border:1px solid ${DS.successBr},color:DS.success,padding:"3px 10px",borderRadius:20,fontWeight:700}}>✓ Verificado</span>}
          </div>
          {tab==="info"&&<><p style={{fontSize:12,color:DS.n600,lineHeight:1.8,marginBottom:10}}>{h.descripcion}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[["📍","Colonia",col?.n],["⏱","Al campus",${col?.min||"?"} min],["👥","Género",h.genero],["⭐","Rating",${h.rating}/5 (${h.reviews})],["🎓","Ideal para",h.carreraIdeal||"Cualquier carrera"]].map(([i,l,v])=>(
                <div key={l} style={{display:"flex",gap:6,padding:"8px 10px",background:DS.n50,borderRadius:7}}><span>{i}</span><div><div style={{fontSize:9,color:DS.n400}}>{l}</div><div style={{fontSize:12,fontWeight:600,color:DS.n900}}>{v}</div></div></div>
              ))}
            </div></>}
          {tab==="amenidades"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{[...h.amenidades,"Agua caliente","Seguridad"].map(a=><div key={a} style={{display:"flex",gap:6,padding:"7px 10px",background:DS.n50,borderRadius:7,fontSize:12,color:DS.n600,alignItems:"center"}}><span style={{color:DS.success}}>✓</span>{a}</div>)}</div>}
          {tab==="reseñas"&&["Ana L. · Comunicación 8°","Marco R. · RI 7°"].map((n,i)=>(
            <div key={n} style={{padding:"10px 0",borderBottom:1px solid ${DS.n100}}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:DS.n900}}>{n}</span><Stars r={[4.9,5][i]} sz={11}/></div>
              <p style={{fontSize:12,color:DS.n600,margin:0,lineHeight:1.7}}>{["Excelente lugar, muy cerca del campus.","Familia increíble, me sentí como en casa."][i]}</p>
            </div>
          ))}
        </div>
        <div style={{...cardMd,padding:18,position:"sticky",top:0}}>
          <div style={{fontSize:20,fontWeight:900,color:DS.n900,marginBottom:4}}>${h.precio.toLocaleString()}<span style={{fontSize:11,color:DS.n400}}>/mes</span></div>
          {!showBook?<>
            <button onClick={()=>setShowBook(true)} style={{...btn("primary","md"),width:"100%",justifyContent:"center",marginBottom:7}}>Solicitar hospedaje</button>
            <button onClick={()=>toggleGuardado(h.id)} style={{...btn("ghost","md"),width:"100%",justifyContent:"center",marginBottom:12}}>{guardado?"♥ Guardado":"♡ Guardar"}</button>
            <div style={{padding:"10px 12px",background:DS.n50,borderRadius:8,fontSize:11,color:DS.n500,lineHeight:1.6}}>Contacto: <strong>{h.contacto}</strong><br/>movilidad@ibero.mx · ext. 4018</div>
          </>:<>
            <div style={{display:"flex",gap:4,marginBottom:12}}>{["Datos","Docs.","Listo"].map((s,i)=><div key={s} style={{flex:1}}><div style={{height:3,borderRadius:2,background:i+1<=step?DS.red500:DS.n100,marginBottom:3}}/><div style={{fontSize:9,fontWeight:600,color:i+1<=step?DS.red500:DS.n400,textAlign:"center"}}>{s}</div></div>)}</div>
            {step===1&&<div>{[["Fecha entrada","date"],["Fecha salida","date"]].map(([l,t])=><div key={l} style={{marginBottom:8}}><label style={lbl}>{l}</label><input type={t} style={inp}/></div>)}<label style={lbl}>Tu carrera</label><select style={{...inp,marginBottom:8}}><option>Selecciona</option>{CARRERAS.map(c=><option key={c}>{c}</option>)}</select></div>}
            {step===2&&["Credencial IBERO","Carta de padres/tutor","Comprobante colegiatura"].map((d,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:DS.n50,borderRadius:7,marginBottom:5}}>
                <span style={{fontSize:11,color:DS.n600}}>{d}</span>
                <label style={{...btn("danger","xs"),cursor:"pointer"}}><input type="file" style={{display:"none"}}/>Subir</label>
              </div>
            ))}
            {step===3&&<div style={{textAlign:"center",padding:"12px 0"}}><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{fontSize:13,fontWeight:700,color:DS.n900,marginBottom:5}}>¡Solicitud enviada!</div><p style={{fontSize:11,color:DS.n500,lineHeight:1.7}}>Respuesta en tu @ibero.mx en 3–5 días hábiles.</p></div>}
            {step<3&&<div style={{display:"flex",gap:6,marginTop:10}}>{step>1&&<button onClick={()=>setStep(s=>s-1)} style={{...btn("ghost","sm"),flex:1}}>← Atrás</button>}<button onClick={()=>setStep(s=>s+1)} style={{...btn("primary","sm"),flex:2,justifyContent:"center"}}>{step===2?"Enviar →":"Siguiente →"}</button></div>}
          </>}
        </div>
      </div>
    </Modal>
  );
}

function BuddyFinder({notify}) {
  const [carrera,setCarrera]=useState("");
  const [sem,setSem]=useState("");
  const [zona,setZona]=useState("all");
  const [tags,setTags]=useState([]);
  const [tipoBusca,setTipoBusca]=useState("all");
  const [contactModal,setContactModal]=useState(null);
  const TAGS=["Arte","Gastronomía","Deportes","Música","Tecnología","Fotografía","Política","Viajes","Literatura","Cine","Sustentabilidad"];
  const filtered=BUDDIES.filter(b=>tipoBusca==="all"||b.tipo===tipoBusca).filter(b=>!carrera||b.carrera===carrera).filter(b=>!sem||b.sem===sem).filter(b=>zona==="all"||b.zona===zona).filter(b=>tags.length===0||tags.some(t=>b.intereses.includes(t)));
  const anfitriones=filtered.filter(b=>b.tipo==="anfitrion");
  const buscadores=filtered.filter(b=>b.tipo==="busca");
  return(
    <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 24px"}}>
      {contactModal&&<ContactModal buddy={contactModal} onClose={()=>setContactModal(null)} notify={notify}/>}
      <SH eyebrow="Conecta" title="Buddy Finder" sub="Encuentra compañeros IBERO por carrera, semestre, intereses y zona"/>
      <div style={{...card,padding:"14px 18px",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
          {[["Tipo",tipoBusca,setTipoBusca,[["all","Todos"],["anfitrion","Ofrecen hospedaje"],["busca","Buscan hospedaje"]]],["Zona",zona,setZona,[["all","Cualquier zona"],...Object.entries(ZONAS).map(([id,z])=>[id,"Zona "+z.label])]]].map(([l,v,fn,opts])=>(
            <div key={l}><label style={lbl}>{l}</label><select value={v} onChange={e=>fn(e.target.value)} style={inp}>{opts.map(([vl,lb])=><option key={vl} value={vl}>{lb}</option>)}</select></div>
          ))}
          <div><label style={lbl}>Carrera</label><select value={carrera} onChange={e=>setCarrera(e.target.value)} style={inp}><option value="">Todas</option>{CARRERAS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>Semestre</label><select value={sem} onChange={e=>setSem(e.target.value)} style={inp}><option value="">Todos</option>{SEMESTRES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <label style={lbl}>Intereses comunes</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{TAGS.map(t=><button key={t} onClick={()=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])} style={{background:tags.includes(t)?DS.red50:"white",border:1.5px solid ${tags.includes(t)?DS.red500:DS.n200},color:tags.includes(t)?DS.red500:DS.n600,borderRadius:20,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:tags.includes(t)?700:400}}>{t}</button>)}</div>
      </div>
      {anfitriones.length>0&&<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{width:7,height:7,borderRadius:"50%",background:DS.success,display:"inline-block"}}/><span style={{fontSize:11,fontWeight:700,color:DS.n600}}>OFRECEN HOSPEDAJE ({anfitriones.length})</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:12,marginBottom:20}}>
          {anfitriones.map(b=><BuddyCard key={b.id} b={b} color={DS.red500} onContact={()=>setContactModal(b)}/>)}
        </div></>}
      {buscadores.length>0&&<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{width:7,height:7,borderRadius:"50%",background:DS.warning,display:"inline-block"}}/><span style={{fontSize:11,fontWeight:700,color:DS.n600}}>BUSCAN HOSPEDAJE ({buscadores.length})</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:12}}>
          {buscadores.map(b=><BuddyCard key={b.id} b={b} color={DS.warning} onContact={()=>setContactModal(b)}/>)}
        </div></>}
      {!filtered.length&&<div style={{textAlign:"center",padding:"50px 0",color:DS.n400}}>Sin resultados. Prueba con menos filtros.</div>}
    </div>
  );
}

function BuddyCard({b,color,onContact}) {
  const z=ZONAS[b.zona]; const col=z?.colonias.find(c=>c.id===b.colonia);
  return(
    <div style={{...card,padding:18}}>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:${color}15,border:1.5px solid ${color}40,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color,flexShrink:0}}>{b.avatar}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:DS.n900,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.nombre}</div>
          <div style={{fontSize:10,color:DS.n500}}>{b.carrera}</div>
          <div style={{fontSize:10,color:DS.n500}}>{b.sem} sem · Zona {z?.label}{col? · ${col.n}:""}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>{b.intereses.map(i=><span key={i} style={{fontSize:9,background:DS.n50,border:1px solid ${DS.n200},color:DS.n600,padding:"2px 7px",borderRadius:5}}>{i}</span>)}</div>
      <div style={{fontSize:10,color:DS.n500,marginBottom:8}}>🌐 {b.idiomas.join(" · ")}</div>
      <p style={{fontSize:11,color:DS.n600,margin:"0 0 10px",lineHeight:1.6,fontStyle:"italic"}}>{b.bio}</p>
      {b.tipo==="anfitrion"&&b.precio&&<div style={{fontSize:13,fontWeight:700,color:DS.n900,marginBottom:10}}>${b.precio.toLocaleString()}<span style={{fontWeight:400,color:DS.n400,fontSize:10}}>/mes</span></div>}
      <button onClick={onContact} style={{...btn(b.tipo==="anfitrion"?"primary":"outline","sm"),width:"100%",justifyContent:"center"}}>{b.tipo==="anfitrion"?"Contactar →":"Conectar →"}</button>
    </div>
  );
}

function ContactModal({buddy,onClose,notify}) {
  const [msg,setMsg]=useState("");
  const [nombre,setNombre]=useState("");
  return(
    <Modal title={Contactar a ${buddy.nombre}} sub={${buddy.carrera} · ${buddy.sem} semestre} onClose={onClose}>
      <div style={{display:"grid",gap:8,marginBottom:16}}>
        {buddy.wa&&<a href={https://wa.me/52${buddy.wa}} target="_blank" rel="noopener" style={{...btn("success","md"),justifyContent:"center",textDecoration:"none",display:"flex"}}>📱 WhatsApp: {buddy.wa}</a>}
        {buddy.ig&&<div style={{...card,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:DS.n900}}>📷 Instagram</span><span style={{fontSize:13,fontWeight:600,color:"#7B2FBE"}}>{buddy.ig}</span>
        </div>}
      </div>
      <div style={{borderTop:1px solid ${DS.n100},paddingTop:14}}>
        <div style={{fontSize:12,fontWeight:700,color:DS.n900,marginBottom:10}}>O envía un mensaje</div>
        <div style={{marginBottom:8}}><label style={lbl}>Tu nombre</label><input value={nombre} onChange={e=>setNombre(e.target.value)} style={inp} placeholder="Tu nombre completo"/></div>
        <div style={{marginBottom:12}}><label style={lbl}>Mensaje</label><textarea rows={3} value={msg} onChange={e=>setMsg(e.target.value)} style={{...inp,resize:"vertical"}} placeholder={Hola ${buddy.nombre.split(" ")[0]}, vi tu perfil en IBERO Hospedaje...}/></div>
        <button onClick={()=>{if(!nombre||!msg)return;notify(Mensaje enviado a ${buddy.nombre} ✓);onClose();}} style={{...btn("primary","md"),width:"100%",justifyContent:"center"}}>Enviar mensaje →</button>
      </div>
    </Modal>
  );
}

function MiEstancia() {
  const [docs,setDocs]=useState({identificacion:"credencial_ibero.jpg"
  });

  // Documentos actualizados
  const docsList=[
    ["identificacion","Identificación del estudiante (Credencial IBERO o pasaporte)"],
    ["aceptacion","Carta de aceptación IBERO"],
    ["seguro","Póliza de seguro médico"],
    ["expediente","Expediente para anfitriones"]
  ];

  const done=docsList.filter(([k])=>docs[k]).length;
  const totalDocs=docsList.length;

  return(
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 24px"}}>
      <SH
        eyebrow="Mi Estancia"
        title="Renata Olivares"
        sub="Comunicación · 5° semestre · Matrícula: 0189345"
      />

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",
          gap:10,
          marginBottom:20
        }}
      >
        {[
          ["Zona","Oriente"],
          ["Colonia","Roma Norte"],
          ["Anfitrión","Familia Gutiérrez"],
          ["Modalidad","Hogar IBERO"],
          ["Inicio","Feb 2026"]
        ].map(([l,v])=>(
          <div key={l} style={{...card,padding:"12px 14px"}}>
            <div
              style={{
                fontSize:9,
                color:DS.n500,
                letterSpacing:"0.06em",
                textTransform:"uppercase",
                marginBottom:2
              }}
            >
              {l}
            </div>

            <div style={{fontSize:12,fontWeight:700,color:DS.n900}}>
              {v}
            </div>
          </div>
        ))}
      </div>

      <div style={{...card,padding:"18px 20px"}}>
        <div
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            marginBottom:10
          }}
        >
          <div style={{fontSize:13,fontWeight:700,color:DS.n900}}>
            Mis documentos
          </div>

          <span
            style={{
              fontSize:12,
              color:done===totalDocs ? DS.success : DS.warning,
              fontWeight:700
            }}
          >
            {done}/{totalDocs}
          </span>
        </div>

        <div
          style={{
            height:5,
            background:DS.n100,
            borderRadius:3,
            marginBottom:14,
            overflow:"hidden"
          }}
        >
          <div
            style={{
              height:"100%",
              width:`${(done/totalDocs)*100}%`,
              background:DS.red500,
              borderRadius:3,
              transition:"width 0.5s"
            }}
          />
        </div>

        {docsList.map(([k,lbl_])=>(
          <div
            key={k}
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              padding:"9px 12px",
              background:DS.n50,
              borderRadius:8,
              marginBottom:6
            }}
          >
            <div>
              <div style={{fontSize:12,color:DS.n900}}>
                {lbl_}
              </div>

              {docs[k]&&(
                <div
                  style={{
                    fontSize:9,
                    color:DS.success,
                    marginTop:1
                  }}
                >
                  📄 {docs[k]}
                </div>
              )}
            </div>

            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <StatusBadge st={docs[k] ? "complete" : "pending"}/>

              {!docs[k]&&(
                <label
                  style={{
                    ...btn("danger","xs"),
                    cursor:"pointer"
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{display:"none"}}
                    onChange={e=>{
                      if(e.target.files[0]){
                        setDocs(d=>({
                          ...d,
                          [k]:e.target.files[0].name
                        }));
                      }
                    }}
                  />
                  Subir
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── ADMIN APP ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

const NOTIFS = [
  {id:1,tipo:"warning",msg:"Familia Garza subió INE vencida — pendiente de rechazar",tiempo:"hace 5 min",leida:false},
  {id:2,tipo:"info",msg:"Nueva solicitud: Ximena P. → Hogar Reyes Olvera",tiempo:"hace 22 min",leida:false},
  {id:3,tipo:"success",msg:"Hogar Gutiérrez Mora publicado en catálogo ✓",tiempo:"hace 1 hora",leida:false},
  {id:4,tipo:"warning",msg:"Factura F-002 enviada a validación — revisar criterios",tiempo:"hace 2 horas",leida:true},
  {id:5,tipo:"info",msg:"Nueva encuesta recibida: Hogar Garza Mora · 4.8 ★",tiempo:"hace 3 horas",leida:true},
];

function AdminApp({back}) {
  const [page,setPage]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const [showNotifs,setShowNotifs]=useState(false);
  const [notifs,setNotifs]=useState(NOTIFS);
  const notify=(msg,type="success")=>setToast({msg,type});
  const unread=notifs.filter(n=>!n.leida).length;
  const markAll=()=>setNotifs(n=>n.map(x=>({...x,leida:true})));
  const NAV=[{id:"dashboard",l:"Dashboard",ic:"📊"},{id:"hogares",l:"Hogares IBERO",ic:"🏡"},{id:"proveedores",l:"Proveedores",ic:"🏢"},{id:"docs_alumnos",l:"Docs. Alumnos",ic:"👥"},{id:"solicitudes",l:"Solicitudes",ic:"📋"},{id:"facturas",l:"Facturas",ic:"💰"},{id:"catalogo_admin",l:"Catálogo",ic:"🗂️"}];
  return(
    <div style={{display:"grid",gridTemplateColumns:"200px 1fr",minHeight:"calc(100vh - 62px)"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showNotifs&&<Modal title="Notificaciones" sub={${unread} sin leer} onClose={()=>setShowNotifs(false)}>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button onClick={markAll} style={btn("ghost","sm")}>Marcar todas como leídas</button></div>
        {notifs.map(n=>{
          const c={success:{bg:DS.successLt,br:DS.successBr,col:DS.success},warning:{bg:DS.warningLt,br:DS.warningBr,col:DS.warning},info:{bg:DS.infoLt,br:DS.infoBr,col:DS.info}}[n.tipo];
          return(
            <div key={n.id} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,leida:true}:x))} style={{...card,padding:"12px 14px",marginBottom:8,background:n.leida?DS.white:c.bg,border:1px solid ${n.leida?DS.n100:c.br},cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontSize:12,color:n.leida?DS.n600:c.col,fontWeight:n.leida?400:600,flex:1}}>{n.msg}</div>
                {!n.leida&&<div style={{width:8,height:8,borderRadius:"50%",background:c.col,flexShrink:0,marginLeft:8,marginTop:2}}/>}
              </div>
              <div style={{fontSize:10,color:DS.n400,marginTop:4}}>{n.tiempo}</div>
            </div>
          );
        })}
      </Modal>}
      <div style={{background:DS.red500,padding:"18px 14px",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"10px 12px",background:"rgba(255,255,255,0.15)",borderRadius:10,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"white"}}>Dir. de Movilidad</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.75)"}}>IBERO CDMX · Admin</div>
        </div>
        <div style={{flex:1}}>
          {NAV.map(n=><button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:page===n.id?700:400,background:page===n.id?"rgba(255,255,255,0.2)":"transparent",color:"white",marginBottom:2,opacity:page===n.id?1:0.85,transition:"all 0.15s"}}><span>{n.ic}</span>{n.l}</button>)}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:14}}>
          <button onClick={back} style={{...btn("ghost","sm"),color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.3)",width:"100%",justifyContent:"center",fontSize:11}}>← Salir</button>
        </div>
      </div>
      <div style={{background:DS.n50,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {/* NOTIF BAR */}
        <div style={{background:DS.white,borderBottom:1px solid ${DS.n100},padding:"8px 24px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}>
          <button onClick={()=>setShowNotifs(true)} style={{...btn("ghost","sm"),position:"relative",fontSize:12}}>
            🔔 Notificaciones
            {unread>0&&<span style={{position:"absolute",top:-4,right:-4,background:DS.red500,color:"white",fontSize:9,fontWeight:700,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
          </button>
        </div>
        {page==="dashboard"&&<AdminDash/>}
        {page==="hogares"&&<AdminHogares notify={notify}/>}
        {page==="proveedores"&&<AdminProveedores notify={notify}/>}
        {page==="docs_alumnos"&&<AdminDocsAlumnos notify={notify}/>}
        {page==="solicitudes"&&<AdminSolicitudes/>}
        {page==="facturas"&&<AdminFacturas notify={notify}/>}
        {page==="catalogo_admin"&&<AdminCatalogo/>}
      </div>
    </div>
  );
}

function AdminDash() {
  const slas=[{kpi:"Validación docs proveedor",obj:"7 días",real:"5.2 días",pct:95,st:"ok"},{kpi:"Asignación alumno-hogar",obj:"3 días",real:"2.8 días",pct:98,st:"ok"},{kpi:"Validación facturas",obj:"5 días",real:"6.1 días",pct:78,st:"warning"},{kpi:"Revisión docs alumnos",obj:"5 días",real:"7.3 días",pct:62,st:"alert"},{kpi:"Respuesta solicitudes",obj:"24 hrs",real:"18 hrs",pct:100,st:"ok"}];
  return(
    <div style={{padding:"24px 32px"}}>
      <SH eyebrow="Dashboard" title="Panel ejecutivo" sub={Semestre Primavera 2026 · ${new Date().toLocaleDateString("es-MX",{dateStyle:"long"})}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:24}}>
        {[["Hogares IBERO activos","12",DS.success,"🏡"],[" Proveedores catálogo","4",DS.info,"🏢"],["Alumnos hospedados","38",DS.red500,"👥"],["Docs. por validar","12",DS.warning,"📋"],["Facturas en revisión","4",DS.warning,"💰"],["Satisfacción prom.","4.7 ★",DS.warning,"⭐"]].map(([l,v,c,ic])=>(
          <div key={l} style={{...card,padding:"14px 16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:9,color:DS.n500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l.trim()}</div><span>{ic}</span></div><div style={{fontSize:20,fontWeight:900,color:c}}>{v.trim()}</div></div>
        ))}
      </div>
      <div style={{...card,padding:"18px 20px",marginBottom:18}}>
        <div style={{fontSize:13,fontWeight:700,color:DS.n900,marginBottom:14}}>SLA — Acuerdos de nivel de servicio</div>
        {slas.map(s=>(
          <div key={s.kpi} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:10,alignItems:"center",padding:"9px 12px",background:s.st==="alert"?DS.errorLt:s.st==="warning"?DS.warningLt:DS.successLt,borderRadius:8,marginBottom:7,border:1px solid ${s.st==="alert"?DS.errorBr:s.st==="warning"?DS.warningBr:DS.successBr}}}>
            <div style={{fontSize:12,fontWeight:600,color:DS.n900}}>{s.kpi}</div>
            <div style={{fontSize:11,color:DS.n500}}>Obj: {s.obj}</div>
            <div style={{fontSize:11,color:DS.n700}}>Real: {s.real}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:4,background:"rgba(0,0,0,0.08)",borderRadius:2}}><div style={{height:"100%",width:${s.pct}%,background:s.st==="ok"?DS.success:s.st==="warning"?DS.warning:DS.error,borderRadius:2}}/></div><span style={{fontSize:11,fontWeight:700,color:s.st==="ok"?DS.success:s.st==="warning"?DS.warning:DS.error,minWidth:28}}>{s.pct}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHogares({notify}) {
  const [detalle,setDetalle]=useState(null);
  const [rechazando,setRechazando]=useState(null);
  const [razon,setRazon]=useState("");
  const hogares=[
    {id:"H1",nombre:"Familia Garza Mora",zona:"poniente",status:"published",docs:8,created:"2025-01-12",alumnos:2,rating:4.9},
    {id:"H2",nombre:"Familia Gutiérrez Mora",zona:"oriente",status:"published",docs:8,created:"2026-01-10",alumnos:1,rating:4.8},
    {id:"H3",nombre:"Familia Reyes Olvera",zona:"norte",status:"approved",docs:8,created:"2026-01-11",alumnos:0,rating:5.0},
    {id:"H4",nombre:"Familia López Vega",zona:"sur",status:"inprogress",docs:5,created:"2026-01-18",alumnos:0,rating:null},
  ];
  return(
    <div style={{padding:"24px 32px"}}>
      {rechazando&&<Modal title="Rechazar documento" sub={rechazando.doc} onClose={()=>setRechazando(null)}>
        <label style={lbl}>Motivo del rechazo</label>
        <textarea rows={3} value={razon} onChange={e=>setRazon(e.target.value)} style={{...inp,resize:"vertical",marginBottom:14}} placeholder="Ej: INE con vigencia vencida. Por favor renueva y recarga."/>
        <div style={{display:"flex",gap:9}}>
          <button onClick={()=>setRechazando(null)} style={{...btn("ghost","md"),flex:1}}>Cancelar</button>
          <button onClick={()=>{notify("Rechazo enviado al anfitrión","error");setRechazando(null);setRazon("");}} style={{...btn("danger","md"),flex:2,justifyContent:"center"}}>Enviar rechazo</button>
        </div>
      </Modal>}
      {detalle&&<Modal title={Expediente Hogar IBERO: ${detalle.nombre}} sub={Zona ${ZONAS[detalle.zona]?.label} · ${detalle.docs}/8 documentos} onClose={()=>setDetalle(null)} wide>
        <div style={{display:"grid",gap:8,marginBottom:16}}>
          {DOCS_PROV.filter(d=>!d.soloProveedor).map((doc,i)=>{const up=i<detalle.docs;return(
            <div key={doc.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 13px",background:DS.n50,borderRadius:9}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:DS.n900}}>{doc.nombre}</div>{up&&<div style={{fontSize:10,color:DS.success}}>📄 documento_cargado.pdf</div>}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <StatusBadge st={up?"complete":"pending"}/>
                {up&&<><button style={btn("ghost","xs")}>Ver</button><button onClick={()=>setRechazando({doc:doc.nombre})} style={btn("danger","xs")}>Rechazar</button></>}
              </div>
            </div>
          );})}
        </div>
        <div style={{display:"flex",gap:9}}>
          <button onClick={()=>{notify(${detalle.nombre} aprobado y publicado ✓);setDetalle(null);}} style={{...btn("success","md"),flex:1,justifyContent:"center"}}>✓ Aprobar y publicar</button>
          <button onClick={()=>setRechazando({doc:"Expediente completo"})} style={{...btn("danger","md"),flex:1,justifyContent:"center"}}>Solicitar correcciones</button>
        </div>
      </Modal>}
      <SH eyebrow="Hogares IBERO" title="Gestión de Hogares IBERO" sub="Familias anfitrionas donde la IBERO es intermediario"/>
      <div style={{...card,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:DS.n50,borderBottom:1px solid ${DS.n100}}}>{["Hogar","Zona","Docs","Alumnos","Rating","Estado","Registro",""].map(h=><th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:9,color:DS.n400,fontWeight:700,letterSpacing:"0.07em"}}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>{hogares.map(h=>(
            <tr key={h.id} style={{borderBottom:1px solid ${DS.n100}}}>
              <td style={{padding:"11px 13px",fontSize:13,fontWeight:700,color:DS.n900}}>{h.nombre}</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600}}>Zona {ZONAS[h.zona]?.label}</td>
              <td style={{padding:"11px 13px",fontSize:11,fontWeight:700,color:h.docs===8?DS.success:DS.warning}}>{h.docs}/8</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600}}>{h.alumnos} activos</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.warning}}>{h.rating?${h.rating} ★:"—"}</td>
              <td style={{padding:"11px 13px"}}><StatusBadge st={h.status}/></td>
              <td style={{padding:"11px 13px",fontSize:10,color:DS.n400}}>{new Date(h.created).toLocaleDateString("es-MX")}</td>
              <td style={{padding:"11px 13px"}}><button onClick={()=>setDetalle(h)} style={btn("outline","xs")}>Ver expediente</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProveedores({notify}) {
  const provs=[{id:"P1",nombre:"Residencia Santa Fe",zona:"poniente",categoria:"residencia",status:"published",docs:8},{id:"P2",nombre:"Valentina Romo",zona:"norte",categoria:"habitacion",status:"inprogress",docs:4},{id:"P3",nombre:"Torres & Blanco",zona:"sur",categoria:"departamento",status:"pending",docs:2}];
  return(
    <div style={{padding:"24px 32px"}}>
      <SH eyebrow="Proveedores" title="Catálogo de hospedaje" sub="Residencias, departamentos y habitaciones · IBERO solo como enlace"/>
      <div style={{...card,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:DS.n50,borderBottom:1px solid ${DS.n100}}}>{["Proveedor","Zona","Categoría","Docs","Estado",""].map(h=><th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:9,color:DS.n400,fontWeight:700,letterSpacing:"0.07em"}}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>{provs.map(p=>(
            <tr key={p.id} style={{borderBottom:1px solid ${DS.n100}}}>
              <td style={{padding:"11px 13px",fontSize:13,fontWeight:700,color:DS.n900}}>{p.nombre}</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600}}>Zona {ZONAS[p.zona]?.label}</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600,textTransform:"capitalize"}}>{p.categoria}</td>
              <td style={{padding:"11px 13px",fontSize:11,fontWeight:700,color:p.docs===8?DS.success:DS.warning}}>{p.docs}/8</td>
              <td style={{padding:"11px 13px"}}><StatusBadge st={p.status}/></td>
              <td style={{padding:"11px 13px"}}><button onClick={()=>notify(Revisando expediente de ${p.nombre},"info")} style={btn("outline","xs")}>Ver expediente</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDocsAlumnos({notify}) {
  const alumnos=[
    {id:"A1",nombre:"Renata Olivares",carrera:"Comunicación",sem:"5°",hogar:"Fam. Gutiérrez",zona:"oriente",docs:{credencial:"complete",carta:"complete",colegiatura:"inprogress",seguro:"pending",contrato:"pending"}},
    {id:"A2",nombre:"Sebastián Cruz",carrera:"Ing. en Ciencia de Datos",sem:"6°",hogar:"—",zona:"poniente",docs:{credencial:"complete",carta:"pending",colegiatura:"pending",seguro:"pending",contrato:"pending"}},
    {id:"A3",nombre:"Ximena Paredes",carrera:"Diseño de Moda",sem:"7°",hogar:"Fam. Reyes Olvera",zona:"norte",docs:{credencial:"complete",carta:"complete",colegiatura:"complete",seguro:"complete",contrato:"approved"}},
  ];
  const [selected,setSelected]=useState(null);
  const docLabels={credencial:"Credencial IBERO",carta:"Carta de padres",colegiatura:"Comprobante colegiatura",seguro:"Seguro médico",contrato:"Contrato de hospedaje"};
  return(
    <div style={{padding:"24px 32px"}}>
      {selected&&<Modal title={Expediente: ${selected.nombre}} sub={${selected.carrera} · ${selected.sem} · Hogar: ${selected.hogar}} onClose={()=>setSelected(null)} wide>
        {Object.entries(selected.docs).map(([k,st])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:DS.n50,borderRadius:9,marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:600,color:DS.n900}}>{docLabels[k]}</span>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <StatusBadge st={st}/>
              {st==="inprogress"&&<><button onClick={()=>notify(${docLabels[k]} aprobado ✓)} style={btn("success","xs")}>Aprobar</button><button onClick={()=>notify(${docLabels[k]} rechazado,"error")} style={btn("danger","xs")}>Rechazar</button></>}
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:9,marginTop:14}}>
          <button onClick={()=>{notify(Expediente aprobado ✓);setSelected(null);}} style={{...btn("success","md"),flex:1,justifyContent:"center"}}>✓ Aprobar expediente</button>
          <button onClick={()=>notify("Notificación enviada al alumno","info")} style={{...btn("outline","md"),flex:1,justifyContent:"center"}}>Notificar al alumno</button>
        </div>
      </Modal>}
      <SH eyebrow="Alumnos" title="Control de documentos" sub="Expedientes de alumnos con solicitud de hospedaje"/>
      <div style={{display:"grid",gap:11}}>
        {alumnos.map(a=>{const doneC=Object.values(a.docs).filter(s=>s==="complete"||s==="approved").length;const total=Object.keys(a.docs).length;return(
          <div key={a.id} style={{...card,padding:"15px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:13,fontWeight:700,color:DS.n900}}>{a.nombre}</div><div style={{fontSize:11,color:DS.n500}}>{a.carrera} · {a.sem} · Zona {ZONAS[a.zona]?.label} · {a.hogar}</div></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:doneC===total?DS.success:DS.warning}}>{doneC}/{total}</span><button onClick={()=>setSelected(a)} style={btn("outline","xs")}>Revisar</button></div>
            </div>
            <div style={{height:4,background:DS.n100,borderRadius:2,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:${(doneC/total)*100}%,background:doneC===total?DS.success:DS.red500,borderRadius:2}}/></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {Object.entries(a.docs).map(([k,st])=><span key={k} style={{fontSize:9,padding:"2px 7px",borderRadius:10,background:st==="complete"||st==="approved"?DS.successLt:st==="inprogress"?DS.warningLt:DS.errorLt,color:st==="complete"||st==="approved"?DS.success:st==="inprogress"?DS.warning:DS.error,border:1px solid ${st==="complete"||st==="approved"?DS.successBr:st==="inprogress"?DS.warningBr:DS.errorBr}}}>{docLabels[k]}</span>)}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

function AdminSolicitudes() {
  return(
    <div style={{padding:"24px 32px"}}>
      <SH eyebrow="Solicitudes" title="Solicitudes de hospedaje" sub="Alumnos que han solicitado hogar · Ciclo Primavera 2026"/>
      <div style={{...card,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:DS.n50,borderBottom:1px solid ${DS.n100}}}>{["Alumno","Carrera","Sem","Zona","Modalidad","Hogar","Estado","Fecha"].map(h=><th key={h} style={{padding:"10px 13px",textAlign:"left",fontSize:9,color:DS.n400,fontWeight:700,letterSpacing:"0.07em"}}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>{[["Renata Olivares","Comunicación","5°","Oriente","Hogar IBERO","Fam. Gutiérrez","published","14 ene"],["Sebastián Cruz","Ing. Ciencia de Datos","6°","Poniente","Catálogo","Sin asignar","pending","13 ene"],["Ximena Paredes","Diseño de Moda","7°","Norte","Hogar IBERO","Fam. Reyes","approved","12 ene"]].map(([al,ca,se,zo,mo,ho,st,fe])=>(
            <tr key={al} style={{borderBottom:1px solid ${DS.n100}}}>
              <td style={{padding:"11px 13px",fontSize:12,fontWeight:700,color:DS.n900}}>{al}</td>
              <td style={{padding:"11px 13px",fontSize:10,color:DS.n600}}>{ca}</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n500}}>{se}</td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600}}>Zona {zo}</td>
              <td style={{padding:"11px 13px"}}><span style={{fontSize:9,background:mo==="Hogar IBERO"?DS.red50:DS.n50,border:1px solid ${mo==="Hogar IBERO"?DS.red200:DS.n200},color:mo==="Hogar IBERO"?DS.red500:DS.n700,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{mo}</span></td>
              <td style={{padding:"11px 13px",fontSize:11,color:DS.n600}}>{ho}</td>
              <td style={{padding:"11px 13px"}}><StatusBadge st={st}/></td>
              <td style={{padding:"11px 13px",fontSize:10,color:DS.n400}}>{fe}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFacturas({notify}) {
  const [validando,setValidando]=useState(null);
  const CRITERIOS=["RFC válido (formato correcto)","Razón social coincide con expediente del hogar","Monto corresponde al periodo facturado","Datos del receptor correctos (IBERO A.C., RFC: UIAA610818HD2)","Periodo de facturación especificado","CFDI con sello digital del SAT"];
  const facturas=[
    {id:"F-001",hogar:"Fam. Garza Mora",alumno:"Lucía Moreno",periodo:"Ago–Dic 2025",monto:27500,rfc:"GAMA750312KV2",status:"paid",criterios:[true,true,true,true,true,true]},
    {id:"F-002",hogar:"Fam. Gutiérrez",alumno:"Renata Olivares",periodo:"Feb–Jul 2026",monto:33000,rfc:"GUMA801205JL3",status:"inprogress",criterios:[true,true,false,true,true,false]},
  ];
  return(
    <div style={{padding:"24px 32px"}}>
      {validando&&<Modal title={Validar: ${validando.id}} sub={${validando.hogar} · ${validando.periodo}} onClose={()=>setValidando(null)}>
        <div style={{display:"grid",gap:7,marginBottom:14}}>
          {CRITERIOS.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",background:validando.criterios[i]?DS.successLt:DS.errorLt,border:1px solid ${validando.criterios[i]?DS.successBr:DS.errorBr},borderRadius:8,alignItems:"center"}}>
              <span style={{fontSize:14,flexShrink:0}}>{validando.criterios[i]?"✓":"✕"}</span>
              <span style={{fontSize:12,color:DS.n900}}>{c}</span>
              {!validando.criterios[i]&&<span style={{fontSize:10,color:DS.error,marginLeft:"auto",fontWeight:700}}>No cumple</span>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9}}>
          {validando.criterios.every(Boolean)?
            <button onClick={()=>{notify(Factura ${validando.id} aprobada ✓);setValidando(null);}} style={{...btn("success","md"),flex:1,justifyContent:"center"}}>✓ Aprobar y programar pago</button>
          :<button onClick={()=>{notify(Factura ${validando.id} rechazada,"error");setValidando(null);}} style={{...btn("danger","md"),flex:1,justifyContent:"center"}}>✕ Rechazar y notificar</button>}
        </div>
      </Modal>}
      <SH eyebrow="Facturas" title="Validación de facturas" sub="Hogares IBERO · Criterios CFDI verificados automáticamente"/>
      {facturas.map(f=>{const ok=f.criterios.filter(Boolean).length;return(
        <div key={f.id} style={{...card,padding:"15px 18px",marginBottom:12,border:1px solid ${f.status==="paid"?DS.successBr:ok===6?DS.successBr:DS.warningBr}}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontSize:11,color:DS.n400}}>{f.id}</span><span style={{fontSize:13,fontWeight:700,color:DS.n900}}>{f.hogar}</span></div>
              <div style={{fontSize:11,color:DS.n500}}>{f.alumno} · {f.periodo} · RFC: {f.rfc}</div>
              <div style={{fontSize:10,color:ok===6?DS.success:DS.warning,marginTop:2}}>{ok}/6 criterios cumplidos</div>
            </div>
            <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:DS.n900,marginBottom:4}}>${f.monto.toLocaleString()}</div><StatusBadge st={f.status}/></div>
          </div>
          <div style={{height:4,background:DS.n100,borderRadius:2,overflow:"hidden",marginBottom:8}}><div style={{height:"100%",width:${(ok/6)*100}%,background:ok===6?DS.success:DS.warning,borderRadius:2}}/></div>
          {f.status!=="paid"&&<button onClick={()=>setValidando(f)} style={btn("outline","sm")}>Revisar criterios</button>}
        </div>
      );})}
    </div>
  );
}

function AdminCatalogo() {
  return(
    <div style={{padding:"24px 32px"}}>
      <SH eyebrow="Catálogo" title="Todos los hospedajes" sub="Vista completa con etiqueta de modalidad"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {HOSPEDAJES.map(h=>{const z=ZONAS[h.zona];const col=z?.colonias.find(c=>c.id===h.colonia);const tipoLabel={hogar_ibero:"Hogar IBERO",residencia:"Residencia",departamento:"Departamento",habitacion:"Habitación"};return(
          <div key={h.id} style={{...card,overflow:"hidden"}}>
            <div style={{position:"relative",height:130}}>
              <img src={h.foto} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",top:7,left:7,display:"flex",gap:4}}>
                <span style={{fontSize:9,background:h.modalidad==="hogar_ibero"?DS.red500:DS.n700,color:"white",padding:"2px 7px",borderRadius:20,fontWeight:700}}>{h.modalidad==="hogar_ibero"?"🏡 Hogar IBERO":"📋 Catálogo"}</span>
              </div>
              {!h.disponible&&<div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.65)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,fontWeight:700,color:DS.n600,background:"white",padding:"4px 10px",borderRadius:20}}>Sin disponibilidad</span></div>}
            </div>
            <div style={{padding:"12px 14px"}}>
              <div style={{fontSize:13,fontWeight:700,color:DS.n900,marginBottom:2}}>{h.nombre}</div>
              <div style={{fontSize:10,color:DS.n500,marginBottom:6}}>Zona {z?.label} · {col?.n} · {tipoLabel[h.tipo]}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:800,color:DS.n900}}>${h.precio.toLocaleString()}/mes</span>
                <Stars r={h.rating} sz={11}/>
              </div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [role,setRole]=useState("estudiante");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  return(
    <div style={{minHeight:"100vh",background:DS.n50,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"min(400px,100%)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logo height={44}/>
          <p style={{fontSize:12,color:DS.n400,marginTop:10}}>Oficina de Hospedaje · Universidad Iberoamericana CDMX</p>
        </div>
        <div style={{...cardMd,padding:28}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:22}}>
            {[["estudiante","🎓","Estudiante"],["proveedor","🏠","Anfitrión"],["admin","🛡️","Admin"]].map(([r,i,l])=>(
              <button key={r} onClick={()=>setRole(r)} style={{background:role===r?DS.red500:"transparent",border:1.5px solid ${role===r?DS.red500:DS.n200},color:role===r?"white":DS.n600,borderRadius:9,padding:"10px 6px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.15s"}}>
                <span style={{fontSize:18}}>{i}</span>{l}
              </button>
            ))}
          </div>
          <div style={{marginBottom:12}}><label style={lbl}>Correo institucional</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="nombre@ibero.mx" style={inp}/></div>
          <div style={{marginBottom:18}}><label style={lbl}>Contraseña</label><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inp}/></div>
          <button onClick={()=>onLogin(role)} style={{...btn("primary","lg"),width:"100%",justifyContent:"center"}}>Iniciar sesión →</button>
          <div style={{textAlign:"center",marginTop:12,fontSize:11,color:DS.n400}}>aranza.garcia@ibero.mx · ext. 4018</div>
        </div>
        <div style={{marginTop:12,padding:"10px 14px",background:DS.white,border:1px solid ${DS.n100},borderRadius:9,fontSize:11,color:DS.n500,textAlign:"center",lineHeight:1.7}}>
          El registro es 100% digital.<br/><strong style={{color:DS.n900}}>Todo se gestiona desde esta plataforma.</strong>
        </div>
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:DS.n50,fontFamily:"'Plus Jakarta Sans','Outfit',system-ui,sans-serif",color:DS.n900}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <nav style={{position:"sticky",top:0,zIndex:200,background:DS.white,borderBottom:1px solid ${DS.n100},boxShadow:DS.sh1,height:60,display:"flex",alignItems:"center",padding:"0 24px",gap:16}}>
        <Logo height={28}/>
        <div style={{flex:1}}/>
        {role&&<div style={{display:"flex",gap:7,alignItems:"center"}}>
          <span style={{fontSize:11,color:DS.n500,borderRight:1px solid ${DS.n200},paddingRight:12,marginRight:4}}>{role==="estudiante"?"🎓 Estudiante":role==="proveedor"?"🏠 Anfitrión":"🛡️ Administración"}</span>
          <button onClick={()=>setRole(null)} style={btn("ghost","sm")}>Cerrar sesión</button>
        </div>}
      </nav>
      {!role&&<Login onLogin={r=>setRole(r)}/>}
      {role==="estudiante"&&<EstudianteApp back={()=>setRole(null)}/>}
      {role==="proveedor"&&<ProveedorApp back={()=>setRole(null)}/>}
      {role==="admin"&&<AdminApp back={()=>setRole(null)}/>}
      {role&&<footer style={{background:DS.red500,padding:"22px 24px",marginTop:48}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <Logo height={22} white/>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Oficina de Hospedaje · aranza.garcia@ibero.mx · ext. 4018</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>© 2026 Universidad Iberoamericana CDMX</div>
        </div>
      </footer>}
    </div>
  );
}
