// Payload is prepended from generated/token-map.json; this is a one-way adapter.
const ids=[];
const collection=figma.variables.createVariableCollection('CREAO CSS · source theme');
collection.renameMode(collection.modes[0].modeId,'Light');
const modes={Light:collection.modes[0].modeId,Dark:collection.addMode('Dark')};
const vars={};
for(const t of data.tokens){
 const v=figma.variables.createVariable(t.figmaName,collection,t.type); vars[t.cssName]=v;
 v.scopes=t.type==='COLOR'?['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR']:t.type==='FLOAT'?(t.cssName.startsWith('--radius')?['CORNER_RADIUS']:t.cssName==='--spacing'?['GAP']:t.cssName.startsWith('--text-')?['FONT_SIZE','LINE_HEIGHT']:t.cssName.startsWith('--container-')?['WIDTH_HEIGHT']:[]):['TEXT_CONTENT'];
 v.setVariableCodeSyntax('WEB','var('+t.cssName+')');
 v.description=t.cssName+' | Source CSS: '+JSON.stringify(t.raw)+' | '+(t.type==='STRING'?'Expression/stack retained as STRING; not a directly bindable CSS expression.':'Normalized for Figma; raw CSS preserved in Git.');
}
for(const t of data.tokens)for(const mode of ['Light','Dark']){
 const target=t.aliases[mode];
 vars[t.cssName].setValueForMode(modes[mode],target&&vars[target]?{type:'VARIABLE_ALIAS',id:vars[target].id}:t.values[mode]);
}
await figma.loadFontAsync({family:'Instrument Sans',style:'Regular'});
await figma.loadFontAsync({family:'Instrument Sans',style:'Medium'});
await figma.loadFontAsync({family:'DM Sans',style:'Medium'});
const page=figma.currentPage;page.name='Source-bound patterns';
function track(n){ids.push(n.id);return n;}
function paint(token){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',vars[token]);}
function box(name,width,fill='--color-surface',component=false){
 const n=track(component?figma.createComponent():figma.createAutoLayout());n.name=name;n.layoutMode='VERTICAL';n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.resize(width,100);n.fills=[paint(fill)];n.itemSpacing=16;n.paddingTop=24;n.paddingBottom=24;n.paddingLeft=24;n.paddingRight=24;
 // Layout spacing uses documented multiples of --spacing; no replacement tokens.
 for(const p of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])n.setBoundVariable(p,vars['--radius-xl']);return n;
}
const styles={};for(const [name,font,size,line] of [['Body','Instrument Sans',16,24],['Label','Instrument Sans',14,20],['Heading','DM Sans',24,32]]){
 const s=figma.createTextStyle();s.name='CREAO/'+name;s.fontName={family:font,style:name==='Body'?'Regular':'Medium'};s.fontSize=size;s.lineHeight={unit:'PIXELS',value:line};styles[name]=s;
}
function text(parent,content,kind='Body',token='--color-foreground'){
 const n=track(figma.createText());n.name=content.slice(0,45);n.fontName=styles[kind].fontName;n.characters=content;n.textStyleId=styles[kind].id;n.fills=[paint(token)];parent.appendChild(n);n.resize(parent.width-parent.paddingLeft-parent.paddingRight,30);n.textAutoResize='HEIGHT';n.layoutSizingHorizontal='FILL';return n;
}
function instance(parent,c){const n=track(c.createInstance());parent.appendChild(n);if(!/Workspace navigation|Primary action/.test(c.name)&&parent.layoutMode==='VERTICAL')n.layoutSizingHorizontal='FILL';return n;}
const button=box('Control / Primary action',200,'--color-primary',true);button.x=160;button.y=160;button.paddingTop=12;button.paddingBottom=12;button.paddingLeft=16;button.paddingRight=16;text(button,'Continue','Label','--color-primary-foreground');button.description='Reusable action. Label is editable; focus/loading/disabled behavior must be implemented and audited in code.';
const field=box('Control / Field',680,'--color-background',true);field.x=160;field.y=300;text(field,'Field label','Label');text(field,'Value or placeholder','Body','--color-muted');field.description='Reusable labeled field. Associate labels and validation text in implementation.';
const nav=box('Pattern / Workspace navigation',224,'--color-chrome',true);nav.x=160;nav.y=520;text(nav,'CREAO','Heading');for(const l of ['New chat','Chat workspace','Agents','Settings'])text(nav,l,'Label');text(nav,'Recent conversations','Label','--color-muted');text(nav,'Research brief\nWeekly planning','Body','--color-sidebar-fg');nav.description='Shared navigation for all three screen patterns. Active/focus states and mobile disclosure require code behavior.';
const message=box('Pattern / Agent message',680,'--color-surface',true);message.x=450;message.y=160;text(message,'Research assistant','Label');text(message,'Here is a draft plan for your review.\n\n1. Confirm the scope\n2. Gather source material\n3. Review the proposed actions');text(message,'Complete · Review before running actions','Label','--color-muted');message.description='Editable agent response. Pending, streaming, stopped and failed states are specified in screen-patterns.md.';
const composer=box('Pattern / Chat composer',680,'--color-surface-alt',true);composer.x=450;composer.y=500;text(composer,'What would you like to work on?','Body','--color-muted');text(composer,'Research assistant · Attach context','Label');const send=instance(composer,button);send.findAllWithCriteria({types:['TEXT']})[0].characters='Send message';composer.description='Reusable composer. Sample copy; Enter sends and Shift+Enter inserts a newline only after explicit code implementation.';
const settings=box('Pattern / Settings section',680,'--color-surface',true);settings.x=1200;settings.y=160;text(settings,'Workspace preferences','Heading');text(settings,'Manage appearance and response preferences.','Body','--color-muted');const sf=instance(settings,field);const st=sf.findAllWithCriteria({types:['TEXT']});st[0].characters='Appearance';st[1].characters='System';const sf2=instance(settings,field);const st2=sf2.findAllWithCriteria({types:['TEXT']});st2[0].characters='Response language';st2[1].characters='English';instance(settings,button);settings.description='Reusable settings section; sample values are examples, not verified CREAO settings.';
const config=box('Pattern / Agent configuration',680,'--color-surface',true);config.x=1200;config.y=680;text(config,'Agent configuration','Heading');for(const [label,value] of [['Name','Research assistant'],['Instructions','Gather sources and prepare a reviewable summary.'],['Model','Choose an available model'],['Tools and permissions','Require review before external actions']]){const f=instance(config,field);const tt=f.findAllWithCriteria({types:['TEXT']});tt[0].characters=label;tt[1].characters=value;}instance(config,button);config.description='Reusable agent form; model/tool options must come from runtime capabilities. No permissions granted by this design.';
const review=box('Creao · Reusable screen patterns',3180,'--color-background');review.x=2100;review.y=160;text(review,'Source-backed tokens · proposed screen compositions','Heading');text(review,'Light / Dark modes share the original CSS names and aliases. These are editable patterns, not captures of authenticated CREAO screens.','Body','--color-muted');
const screens=[];for(const mode of ['Light','Dark']){
 const row=box(mode+' patterns',3132,'--color-background');row.layoutMode='HORIZONTAL';row.counterAxisSizingMode='AUTO';row.paddingLeft=0;row.paddingRight=0;review.appendChild(row);
 for(const type of ['Chat workspace','Settings','Agent configuration']){
  const screen=box(type+' / '+mode,1028,'--color-background');row.appendChild(screen);screen.setExplicitVariableModeForCollection(collection,modes[mode]);text(screen,type,'Heading');
  const body=box('Workspace shell',980,'--color-background');body.layoutMode='HORIZONTAL';body.counterAxisSizingMode='AUTO';body.paddingLeft=0;body.paddingRight=0;screen.appendChild(body);instance(body,nav);
  const main=box('Main content',708,'--color-background');main.paddingLeft=14;main.paddingRight=14;body.appendChild(main);
  if(type==='Chat workspace'){text(main,'Plan a research brief','Heading');text(main,'You · Help me organize a research brief.','Body','--color-muted');instance(main,message);instance(main,composer);}else instance(main,type==='Settings'?settings:config);
  screens.push({id:screen.id,name:screen.name,width:screen.width,height:screen.height});
 }
}
figma.viewport.scrollAndZoomIntoView([review]);
return {createdNodeIds:ids,collectionId:collection.id,modes,variableCount:Object.keys(vars).length,variables:Object.entries(vars).map(([css,v])=>({css,id:v.id})),componentIds:[button,field,nav,message,composer,settings,config].map(n=>({id:n.id,name:n.name})),reviewId:review.id,screens,textStyles:Object.values(styles).map(s=>({id:s.id,name:s.name}))};
