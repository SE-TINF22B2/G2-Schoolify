## Backend Development
Unser Backend wird, wie in unserer Wiki im Teil der Technologien erklärt, mit NestJS entwickelt. Dabei verwenden wir einige Funktionen und Methodiken, die hier genauer erklärt werden. Die Schritte unter dem Teil [Installation](#installation) sind vor Starten des Backends auszuführen.
#### Installation

```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Ordnerstruktur
Die Ordnerstruktur ist relativ simple. 






### Source Code
Unter dem Ordner _src_ wird der Source Code eingefügt. Dort gibt es für jede Komponente im Backend ein NestJS Module. Wie genau Modules mit zugehörigem Controller und Service in NestJS aufgebaut sind, kann [hier](https://docs.nestjs.com/first-steps) nachgelesen werden. In jedem Issue ist die Architektur beschrieben, aus der die Komponente für den Code herausgelesen werden kann.

Das Prisma Objekt ist zuständig für alle Anfragen an unsere Datenbank. In jedem Module muss daher ein neues Prismaobjekt als Provider erstellt werden. Im zugehörigem Controller kann durch ein Inject auf dieses Objekt automatisch zugegriffen werden. Inject ist ebenfalls ein Tool von NestJS, das wir verwenden.
```typescript
@Inject('PRISMA') private prisma: PrismaClient<Prisma.PrismaClientOptions>
```
Der Controller stellt die Schnittstellen dem Benutzer zur Verfügung und ist lediglich für die Validierung der Rolle zuständig. Ist diese validiert, ruft der Controller die zugehörige Methode im Service auf und übergibt dabei auch das Prisma Objekt.
Die Convention sieht vor, dass in jeder API Anfrage die Rolle des Benutzers (z.B. Lehrer, Schüler, etc.) im Header durch das Attribut _role_ mitgegeben wird.

### Tests
Der Ordner _tests_ ist eine Kopie des _src_ Ordners. Hier werden alle Unit Tests für alle Komponenten geschrieben. Wie genau unser Testkonzept aussieht, kann auch [hier](https://github.com/SE-TINF22B2/G2-Schoolify/wiki/Projekthandbuch#tests) in unserem Projekthandbuch nachgelesen werden. Es müssen für alle Funktionen im Backend Unit Tests geschrieben werden, die funktionieren! Bei offenen Fragen kann der Entwickler immer bei bereits vorhandenen Tests sich die Struktur anschauen und nachbauen. 

#### Tests Commands

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Dto
Für unsere API Schnittstellen verwenden wir sogenannte _Dtos_, mit denen genau beschrieben werden kann, was für Objekte unsere Schnittstelle übergeben bekommen muss. Dadurch kann eine Validation bereits in der Anfrage geschehen und muss nicht manuell vom Entwickler gecodet werden.
Beispiel für ein _Dto_ Objekt, das die Eingaben bereits validiert:
```typescript
export class User_Login_DataDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
```
Hier wird vorausgesetzt, dass die Anfrage ein Objekt mit den Attributen _email_ und _password_ erhält. Durch die Annotationen werden beide Validiert, dass sie nicht leer sind und jeweils eine richtige email Adresse oder ein String sind. Dieses Konzept wird bei allen Schnittstellen von uns verwendet. Auch hier kann sich bei bereits erstellten _Dtos_ orientiert werden.

### Prisma
Im Prisma Ordner sind alle relevanten Dateien für die Datenbank Anbindung. Dort ist zum Beispiel im _schema.prisma_ File unser Datenbankschema definiert, also die Entitäten und ihre Beziehungen. Zudem werden im _data/testdate_ Ordner Mockdaten generiert, die automatisch auf die Datenbank geschrieben werden können, damit als Entwickler korrekte Daten zur Verfügung stehen und das Testen vereinfacht wird. Ansonsten ist dieser Ordner für die eigentliche Entwicklung im Backend nicht relevant. 
Wichtige Commands für das Backend mit Prisma sind [hier](https://github.com/SE-TINF22B2/G2-Schoolify/wiki/Projekthandbuch#nutzung-backend--script) im Projekthandbuch geschrieben.

Alle anderen Ordner sind für die Entwicklung im Backend erstmal irrelevant und sollten nicht angefasst werden.


## License

Nest is [MIT licensed](LICENSE).
