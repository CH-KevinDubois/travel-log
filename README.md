# TraveLog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Type `git clone` with the URL of the repository

```bash
$ git clone https://github.com/CH-KevinDubois/travel-log
```

Run `ng serve --open` for a dev server, it will open your navigotor to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# Approche

## Idée initiale

Je suis parti de l'idée de tout faire sur deux vues principales, une première permettant de visualiser l'ensemble de tous les voyages, alors que la seconde, seulement ses propres voyages. Pour la saisie des informations (se logger, s'inscrire, ajouter un nouveau voyage, ...) je pensais utiliser des boites de dialogues et pour afficher les voyages et les places, j'imaginais utiliser deux listes superposées (une sélection dans la première permettant de passer dans la seconde) et d'utiliser une sorte de breadcrumb. 

Le but premier était de découvrir ce que permet le framework, n'ayant aucune connaissance préalable ni d'Angular ni de Vue ni de React je ne savais pas vers quoi je m'orientais. Pour ce que est de l'ésthétiquement, je me suis dit pourquoi pas partir sur Angular Material, sachant que je connaissais un peu de Bootsrapt (on est là pour découvrir et pour apprendre non?).

<br>

![alt text](.\resources\Travelog.jpg "Draft")


Avec un peu de recule, je peux dire que je ne me suis pas franchement simplifié la vie. Premièrement du point de vue de la structure des pages, une approche plus simple mais efficace aurait été de faire une page par "action", ni plus ni moins. Deuxièment, du point de vue de l'utilisation de Angular Material, qui n'est mine de rien pas si facile à appréhender avec tout juste deux mois de cours sur Angular.

## Problèmes rencontrés

Le problème principal rencontré avec la structure que j'ai adopté est le **state** et **data managment**. Comment garder une cohérence dans l'application et synchorniser les actions de l'utilisateur et les données entre les divers composants? J'ai passé par toutes les étapes, en commancant par utiliser des @Input et @Output. Francement cela devient vite impossible de s'y retrouver quand les composants ne sont dans la configuration parent-enfant (chaîner des inputs c'est moche). J'ai testé le @ChildView (je ne sais pas si c'est vraiement propre comme approche), mais cela ne règle en rien le problème de "unrelated components". Au final, comme rien ne fonctionnait simplement, je me suis tourné vers **RxJs**. 

C'est beau, c'est "relativement" simple, c'est structuré, mais attention au subsrtiptions. J'ai cherché des heures durant d'où provenait certaines duplications d'actions, la réponse était dans le suscribe(). Je ne pense pas avoir été assez avertis sur le fait que les subscirpitons peuvent foutre un bordel total si elles ne sont pas unsuscribed. Pour régler ce problème (le faire manuellement est très lourd), j'ai simplemnt créer un tableau de sucription et à la destruction du composant j'itère simplement sur le tableau et unsucribe toutes les subscriptions stockées.

Je ne me suis pas attaqué au téléchargement d'une image au sein d'une api externe pour gérer les images de l'application. J'ai pensé pouvoir détourner le champs **pictureUrl** pour socker une image en base64, mais le champs n'est pas assez long pour des images de grandes taille. Au final, je me suis simplment contenté de faire en sorte que l'utilisateur puisse indiquer une url et j'affiche l'image si l'url est donnée.  

Je n'ai pas créer de page de recherche. J'ai simplement ajouté au dessus de la tables de voyage des champs de recherce et de filtre à l'aide de chips Angular Material. Les fonctions de recherches sont basées sur l'API Travel Log et les query parameter search, alors que la fonction de filtre est implémentée directement sur les données retournées. Dans le cas où l'utilisateur insert plusioeur mot dans le champs filtre ou recherche le comportment de la fonction est différent. La recherche a un comportement OR "mot1" ou "mot2" alors que le filtre a un comportemnet AND "mot1" et "mot2". 