import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  console.log(propriedades);

  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.usuarioAleatorio}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className ="boxLink" href= {`https://github.com/${propriedades.usuarioAleatorio}`}>
          @{propriedades.usuarioAleatorio}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioAleatorio = 'java2124';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = ['aarthurssl', 'LeoMoretti',
  'juunegreiros',
  'omariosouto',
  'peas',
  'marcobrunodev'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function (){
    fetch('https://api.github.com/users/java2124/followers')
    .then((respostaServidor) => {
      return respostaServidor.json();
    })
    .then((respostaCompleta) => {
      setSeguidores(respostaCompleta);
    })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'd576aa6debd113a4e35cadc29fac95',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })
  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style = {{ gridArea : 'profileArea'}}>
          <ProfileSidebar  usuarioAleatorio = {usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style = {{ gridArea : 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className = "subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCreateCommunity(e){
              e.preventDefault();
              const formData = new FormData (e.target);
              const comunidade = {
                title: formData.get('title'),
                imageUrl: formData.get('image'),
                creatorSlug: usuarioAleatorio,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label= "Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label= "Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style = {{ gridArea : 'profileRelationsArea'}}>
          
          <ProfileRelationsBox title = "Seguidores" items= {seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
                {comunidades.map ((itemAtual) => {
                  return  (
                    <li key={itemAtual.id}>
                      <a href={`/communities/${itemAtual.title}`}>
                      <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                      </li>
                  )
                })}
              </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
                {pessoasFavoritas.map ((itemAtual) => {
                  return (
                    <li key={itemAtual}>
                      <a href={`/users/${itemAtual}`}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                      </li>
                  )
                })}
              </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
