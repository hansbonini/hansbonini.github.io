---
layout: post
title: "Otimizando o desempenho do Arch Linux"
description: Procedimentos que podem ser empregados na melhoria e otimização do desempenho do Arch Linux.
image: 'http://i.imgur.com/TNXuv.png'
category: ['arch']
twitter_text: Otimizando o desempenho do Arch Linux.
introduction: 'Minha instalação do Arch está lenta, e agora? Bem vamos falar de recursos que podem ser empregados para melhorar o desempenho do seu sistema. Lembrando que uma boa configuração é fruto de tentativas e benchmarks exaustivos que você deve aplicar na sua instalação. Este artigo vai servir como uma luz no fim do túnel pra você'
---

Minha instalação do Arch está lenta, e agora? Bem vamos falar de recursos que podem ser empregados para melhorar o desempenho do seu sistema. Lembrando que uma boa configuração é fruto de tentativas e benchmarks exaustivos que você deve aplicar na sua instalação. Este artigo vai servir como uma luz no fim do túnel pra você não se perder por ai, mas não se empolgue que o conteúdo dele pode ser encontrado nas **wikipédias** por ai, apenas compilei aqui para facilitar o entendimento. E é claro que vale lembra que existe muito mais coisas que você pode fazer... enfim, deixemos de blábláblá.

## ZRAM

Pode soar desconhecido para alguns, muito complicado para outros, e bobo para os **heavy-users**. Porém ativar o uso da ZRAM seja ela independente ou ativa na partição **SWAP** gera um desempenho surpreendente se comparado a um sistema sem o uso da mesma. Bom, vamos ao passos de configuração!
### Carregando o módulo no Kernel
A forma mais fácil de você ativa-la é primeiro carregar o módulo no kernel atráves do comando `sudo modprobe zram` porém na impede que você ative criando um arquivo em `/etc/modules-load.d/zram.conf` com o conteúdo:
´´´
zram
´´´

### Configurando o Numero de ZRAM's necessários
Aqui você vai ter que confiar em mim e aceitar que o número importante para nós de ZRAM é 2. Porém se não quer confiar então vá pesquisar mais afundo na wiki do Arch ;3. Pois bem insira dentro do arquivo `/etc/modprobe.d/zram.conf` a seguinte configuração:
```
options zram num_devices=2
```
Só salvar e let's go para o próximo passos

### Regras UDEV para manipulaçao da ZRAM dentro da SWAP
Aqui está o segredo da nossa otimização: as regras **UDEV**. Elas que serão responsaveis por movimentar os desepejos de memória da ZRAM dentro da partição SWAP. Criando o arquivo `/etc/udev/rules.d/99-zram.rules` com o conteúdo:
```
KERNEL=="zram0", ATTR{disksize}="512M" RUN="/usr/bin/mkswap /dev/zram0", TAG+="systemd"
KERNEL=="zram1", ATTR{disksize}="512M" RUN="/usr/bin/mkswap /dev/zram1", TAG+="systemd"
```
movimentaremos nossas duas unidades de ZRAM de tamanho definido de 512M para dentro da partição SWAP. BINGO!
Agora só precisamos criar as entradas dentro do `/etc/fstab` e estamos prontos para ser felizes.

### fstab
Dentro do arquivo `/etc/fstab` vamos adicionar a entrada para as duas unidades de ZRAM inserindo o seguinte contéudo:
```
/dev/zram0 none swap defaults 0 0
/dev/zram1 none swap defaults 0 0
```

Basta reiniciar o sistema e na próxima inicialização e uso conseguimos notar uma melhora de perfomance e um sistema mais suave na abertura de programas e execução de tarefas. ;)

## I/O Schedulers
Essa é outra opção muito interessante para aumentar o rendimento do sistema. Mudando o agendador I/O de single para multi-queue o desempenho melhora surpreendentemente. Não entrarei em aspectos técnicos (meu tempo e tarefas a executar não me permitem ;3) mas geralmente a maioria das distros vem com o single-queue configurado por padrão, o que nos leva a querer e muito essa mudança. Para isso será necessário adicionar o parametro `scsi_mod.use_blk_mq=1` à linha de comando do kernel. Vocẽ não tem idéia de como faz isso? Tá eu te ajudo.

### Adicionando o parametro scsi_mod ao kernel
Para adicionar o parametro `scsi_mod.use_blk_mq=1` você deve localizar o arquivo `/etc/default/grub` e inserir ele dentro da constante `GRUB_CMDLINE_LINUX_DEFAULT`, assim teremos algo parecido com isso:
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash scsi_mod.use_blk_mq=1"
```
Pode ser que o seu sistema tenha mais ou menos parametros nessa linha, mas a ordem em que você inserir o mesmo não vai importar. Não esqueça de recompilar o **GRUB** e cuidado caso o mesmo esteja na **EFI**.

### Ativando o BFQ para multiplas queues do agendador
Para finalizar a configuração ative o BFQ assim o agendador multiplo vai começar a funcionar, o comando para isso é um **echo** no arquivo `/sys/block/sda/queue/scheduler`:
```
echo bfq > /sys/block/sda/queue/scheduler
```
Se você tiver mais de uma partição e quiser ativar o agendador nelas também é só substituir o `sda` pela partição desejada.

## PROFILE-SYNC-DAEMON e os Browsers.
Essa é uma dica pouco manjada mas você vai gostar muito tenho certeza. Eu pelo menos não vivo sem ela em qualquer instalação do arch, já que o danado do Chrome vive comendo memória do sistema e quando estou programando com vários aplicativos abertos ele insiste em travar tudo. Só Deus pra saber meu desespero! Porém tem esse recurso bacana que gerencia a memória usada pelos processadores e o lixo que eles geram jogando tudo para a `/tmpfs`, que maravilha!

### Instalando o profile-sync-daemon
Essa é facil né? `yaourt profile-sync-daemon` vulgo `psd`.

### Configurando o profile-sync-daemon
A configuração do processo é bem simples basta abrir o arquivo `~/.config/psd/psd.conf` e inserir na constante `BROWSERS` os navegadores que você está usando, sem segredo! Fica aqui um exemplo:
```
# List browsers separated by spaces to include in the sync. Useful if you do not
# wish to have all possible browser profiles sync'ed which is the default if
# this variable is left commented.
#
# Possible values:
#  chromium
#  chromium-dev
#  conkeror.mozdev.org
#  epiphany
#  firefox
#  firefox-trunk
#  google-chrome
#  google-chrome-beta
#  google-chrome-unstable
#  heftig-aurora
#  icecat
#  inox
#  luakit
#  midori
#  opera
#  opera-beta
#  opera-developer
#  opera-legacy
#  otter-browser
#  qupzilla
#  qutebrowser
#  palemoon
#  rekonq
#  seamonkey
#  surf
#  vivaldi
#  vivaldi-snapshot
#
BROWSERS="google-chome chromium firefox"
```

### Ativando o processo no systemd
Para ativar o processo no systemd é a velha premissa de executar o `systemctl enable`, porém aqui executaremos o mesmo a nível de usuário para gerenciar os navegadores somente da nossa conta: `systemctl --user enable psd.service`

Bom, por hoje é só! Breve trago mais novidades de otimização do ARCH. Espero que gostem e comentem qual foi o resultado nas suas instalações! ;*
