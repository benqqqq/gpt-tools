/**
 * In the official document such as https://mermaid.js.org/syntax/flowchart.html,
 * use
 * document.querySelectorAll('[role="graphics-document document"]').forEach(node => node.remove())
 * document.querySelectorAll('span.lang').forEach(node => node.remove())
 * to remove image and unnecessary tag
 * then copy all the text into here
 */

export const sequenceDiagramDocument = `
Mermaid Js Sequence Diagram Document

Syntax
Participants
The participants can be defined implicitly as in the first example on this page. The participants or actors are rendered in order of appearance in the diagram source text. Sometimes you might want to show the participants in a different order than how they appear in the first message. It is possible to specify the actor's order of appearance by doing the following:

Code:
mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hi Bob
    Bob->>Alice: Hi Alice

Actors
If you specifically want to use the actor symbol instead of a rectangle with text you can do so by using actor statements as per below.

Code:
mermaid
sequenceDiagram
    actor Alice
    actor Bob
    Alice->>Bob: Hi Bob
    Bob->>Alice: Hi Alice

Aliases
The actor can have a convenient identifier and a descriptive label.

Code:
mermaid
sequenceDiagram
    participant A as Alice
    participant J as John
    A->>J: Hello John, how are you?
    J->>A: Great!

Grouping / Box
The actor(s) can be grouped in vertical boxes. You can define a color (if not, it will be transparent) and/or a descriptive label using the following notation:

box Aqua Group Description
... actors ...
end
box Group without description
... actors ...
end
box rgb(33,66,99)
... actors ...
end
INFO

If your group name is a color you can force the color to be transparent:

box transparent Aqua
... actors ...
end
Code:
mermaid
sequenceDiagram
    box Purple Alice & John
    participant A
    participant J
    end
    box Another Group
    participant B
    participant C
    end
    A->>J: Hello John, how are you?
    J->>A: Great!
    A->>B: Hello Bob, how is Charly ?
    B->>C: Hello Charly, how are you?

Messages
Messages can be of two displayed either solid or with a dotted line.

[Actor][Arrow][Actor]:Message text
There are six types of arrows currently supported:

Type\tDescription
->\tSolid line without arrow
-->\tDotted line without arrow
->>\tSolid line with arrowhead
-->>\tDotted line with arrowhead
-x\tSolid line with a cross at the end
--x\tDotted line with a cross at the end.
-)\tSolid line with an open arrow at the end (async)
--)\tDotted line with a open arrow at the end (async)

Activations
It is possible to activate and deactivate an actor. (de)activation can be dedicated declarations:

Code:
mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    activate John
    John-->>Alice: Great!
    deactivate John

There is also a shortcut notation by appending +/- suffix to the message arrow:

Code:
mermaid
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    John-->>-Alice: Great!

Activations can be stacked for same actor:

Code:
mermaid
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!

Notes
It is possible to add notes to a sequence diagram. This is done by the notation Note [ right of | left of | over ] [Actor]: Text in note content

See the example below:

Code:
mermaid
sequenceDiagram
    participant John
    Note right of John: Text in note

It is also possible to create notes spanning two participants:

Code:
mermaid
sequenceDiagram
    Alice->John: Hello John, how are you?
    Note over Alice,John: A typical interaction

It is also possible to add a line break (applies to text input in general):

Code:
mermaid
sequenceDiagram
    Alice->John: Hello John, how are you?
    Note over Alice,John: A typical interaction<br/>But now in two lines

Loops
It is possible to express loops in a sequence diagram. This is done by the notation

loop Loop text
... statements ...
end
See the example below:

Code:
mermaid
sequenceDiagram
    Alice->John: Hello John, how are you?
    loop Every minute
        John-->Alice: Great!
    end
  Alt
It is possible to express alternative paths in a sequence diagram. This is done by the notation

alt Describing text
... statements ...
else
... statements ...
end
or if there is sequence that is optional (if without else).

opt Describing text
... statements ...
end
See the example below:

Code:
mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end  
Parallel
It is possible to show actions that are happening in parallel.

This is done by the notation

par [Action 1]
... statements ...
and [Action 2]
... statements ...
and [Action N]
... statements ...
end
See the example below:

Code:
mermaid
sequenceDiagram
    par Alice to Bob
        Alice->>Bob: Hello guys!
    and Alice to John
        Alice->>John: Hello guys!
    end
    Bob-->>Alice: Hi Alice!
    John-->>Alice: Hi Alice!
It is also possible to nest parallel blocks.

Code:
mermaid
sequenceDiagram
    par Alice to Bob
        Alice->>Bob: Go help John
    and Alice to John
        Alice->>John: I want this done today
        par John to Charlie
            John->>Charlie: Can we do this today?
        and John to Diana
            John->>Diana: Can you help us today?
        end
    end
	
It is also possible to nest parallel blocks.

Code:
mermaid
sequenceDiagram
    par Alice to Bob
        Alice->>Bob: Go help John
    and Alice to John
        Alice->>John: I want this done today
        par John to Charlie
            John->>Charlie: Can we do this today?
        and John to Diana
            John->>Diana: Can you help us today?
        end
    end

Critical Region
It is possible to show actions that must happen automatically with conditional handling of circumstances.

This is done by the notation

critical [Action that must be performed]
... statements ...
option [Circumstance A]
... statements ...
option [Circumstance B]
... statements ...
end
See the example below:

Code:
mermaid
sequenceDiagram
    critical Establish a connection to the DB
        Service-->DB: connect
    option Network timeout
        Service-->Service: Log error
    option Credentials rejected
        Service-->Service: Log different error
    end

It is also possible to have no options at all

Code:
mermaid
sequenceDiagram
    critical Establish a connection to the DB
        Service-->DB: connect
    end
This critical block can also be nested, equivalently to the par statement as seen above.

Break
It is possible to indicate a stop of the sequence within the flow (usually used to model exceptions).

This is done by the notation

break [something happened]
... statements ...
end
See the example below:

Code:
mermaid
sequenceDiagram
    Consumer-->API: Book something
    API-->BookingService: Start booking process
    break when the booking process fails
        API-->Consumer: show failure
    end
    API-->BillingService: Start billing process

Background Highlighting
It is possible to highlight flows by providing colored background rects. This is done by the notation

The colors are defined using rgb and rgba syntax.

rect rgb(0, 255, 0)
... content ...
end
rect rgba(0, 0, 255, .1)
... content ...
end
See the examples below:

Code:
mermaid
sequenceDiagram
    participant Alice
    participant John

    rect rgb(191, 223, 255)
    note right of Alice: Alice calls John.
    Alice->>+John: Hello John, how are you?
    rect rgb(200, 150, 255)
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    end
    John-->>-Alice: I feel great!
    end
    Alice ->>+ John: Did you want to go to the game tonight?
    John -->>- Alice: Yeah! See you there.

Comments
Comments can be entered within a sequence diagram, which will be ignored by the parser. Comments need to be on their own line, and must be prefaced with %% (double percent signs). Any text after the start of the comment to the next newline will be treated as a comment, including any diagram syntax

Code:
mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    %% this is a comment
    John-->>Alice: Great!

Entity codes to escape characters
It is possible to escape characters using the syntax exemplified here.

Code:
mermaid
sequenceDiagram
    A->>B: I #9829; you!
    B->>A: I #9829; you #infin; times more!

Numbers given are base 10, so # can be encoded as #35;. It is also supported to use HTML character names.

Because semicolons can be used instead of line breaks to define the markup, you need to use #59; to include a semicolon in message text.

sequenceNumbers
It is possible to get a sequence number attached to each arrow in a sequence diagram. This can be configured when adding mermaid to the website as shown below:

html
<script>
  mermaid.initialize({ sequence: { showSequenceNumbers: true } });
</script>
It can also be turned on via the diagram code as in the diagram:

Code:
mermaid
sequenceDiagram
    autonumber
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!

Actor Menus
Actors can have popup-menus containing individualized links to external pages. For example, if an actor represented a web service, useful links might include a link to the service health dashboard, repo containing the code for the service, or a wiki page describing the service.

This can be configured by adding one or more link lines with the format:

link <actor>: <link-label> @ <link-url>
Code:
sequenceDiagram
    participant Alice
    participant John
    link Alice: Dashboard @ https://dashboard.contoso.com/alice
    link Alice: Wiki @ https://wiki.contoso.com/alice
    link John: Dashboard @ https://dashboard.contoso.com/john
    link John: Wiki @ https://wiki.contoso.com/john
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!

Advanced Menu Syntax
There is an advanced syntax that relies on JSON formatting. If you are comfortable with JSON format, then this exists as well.

This can be configured by adding the links lines with the format:

links <actor>: <json-formatted link-name link-url pairs>
An example is below:

Code:
mermaid
sequenceDiagram
    participant Alice
    participant John
    links Alice: {"Dashboard": "https://dashboard.contoso.com/alice", "Wiki": "https://wiki.contoso.com/alice"}
    links John: {"Dashboard": "https://dashboard.contoso.com/john", "Wiki": "https://wiki.contoso.com/john"}
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
`

export const flowchartDocument = `
Mermaid Js Flowchart Document

Flowcharts - Basic Syntax
Flowcharts are composed of nodes (geometric shapes) and edges (arrows or lines). The Mermaid code defines how nodes and edges are made and accommodates different arrow types, multi-directional arrows, and any linking to and from subgraphs.

WARNING

If you are using the word "end" in a Flowchart node, capitalize the entire word or any of the letters (e.g., "End" or "END"), or apply this workaround. Typing "end" in all lowercase letters will break the Flowchart.

A node (default)
Code:

---
title: Node
---
flowchart LR
    id
INFO

The id is what is displayed in the box.

TIP

Instead of flowchart one can also use graph.

A node with text
It is also possible to set text in the box that differs from the id. If this is done several times, it is the last text found for the node that will be used. Also if you define edges for the node later on, you can omit text definitions. The one previously defined will be used when rendering the box.

Code:

---
title: Node with text
---
flowchart LR
    id1[This is the text in the box]
Unicode text
Use " to enclose the unicode text.

Code:

flowchart LR
    id["This ❤ Unicode"]
Markdown formatting
Use double quotes and backticks "\` text \`" to enclose the markdown text.

Code:

%%{init: {"flowchart": {"htmlLabels": false}} }%%
flowchart LR
    markdown["\`This **is** _Markdown_\`"]
    newLines["\`Line1
    Line 2
    Line 3\`"]
    markdown --> newLines
Direction
This statement declares the direction of the Flowchart.

This declares the flowchart is oriented from top to bottom (TD or TB).

Code:

flowchart TD
    Start --> Stop
This declares the flowchart is oriented from left to right (LR).

Code:

flowchart LR
    Start --> Stop
Possible FlowChart orientations are:

TB - Top to bottom
TD - Top-down/ same as top to bottom
BT - Bottom to top
RL - Right to left
LR - Left to right
Node shapes
A node with round edges
Code:

flowchart LR
    id1(This is the text in the box)
A stadium-shaped node
Code:

flowchart LR
    id1([This is the text in the box])
A node in a subroutine shape
Code:

flowchart LR
    id1[[This is the text in the box]]
A node in a cylindrical shape
Code:

flowchart LR
    id1[(Database)]
A node in the form of a circle
Code:

flowchart LR
    id1((This is the text in the circle))
A node in an asymmetric shape
Code:

flowchart LR
    id1>This is the text in the box]
Currently only the shape above is possible and not its mirror. This might change with future releases.

A node (rhombus)
Code:

flowchart LR
    id1{This is the text in the box}
A hexagon node
Code:

flowchart LR
    id1{{This is the text in the box}}
Parallelogram
Code:

flowchart TD
    id1[/This is the text in the box/]
Parallelogram alt
Code:

flowchart TD
    id1[\\This is the text in the box\\]
Trapezoid
Code:

flowchart TD
    A[/Christmas\\]
Trapezoid alt
Code:

flowchart TD
    B[\\Go shopping/]
Double circle
Code:

flowchart TD
    id1(((This is the text in the circle)))
Links between nodes
Nodes can be connected with links/edges. It is possible to have different types of links or attach a text string to a link.

A link with arrow head
Code:

flowchart LR
    A-->B
An open link
Code:

flowchart LR
    A --- B
Text on links
Code:

flowchart LR
    A-- This is the text! ---B
or

Code:

flowchart LR
    A---|This is the text|B
A link with arrow head and text
Code:

flowchart LR
    A-->|text|B
or

Code:

flowchart LR
    A-- text -->B
Dotted link
Code:

flowchart LR
   A-.->B;
Dotted link with text
Code:

flowchart LR
   A-. text .-> B
Thick link
Code:

flowchart LR
   A ==> B
Thick link with text
Code:

flowchart LR
   A == text ==> B
An invisible link
This can be a useful tool in some instances where you want to alter the default positioning of a node.

Code:

flowchart LR
    A ~~~ B
Chaining of links
It is possible declare many links in the same line as per below:

Code:

flowchart LR
   A -- text --> B -- text2 --> C
It is also possible to declare multiple nodes links in the same line as per below:

Code:

flowchart LR
   a --> b & c--> d
You can then describe dependencies in a very expressive way. Like the one-liner below:

Code:

flowchart TB
    A & B--> C & D
If you describe the same diagram using the the basic syntax, it will take four lines. A word of warning, one could go overboard with this making the flowchart harder to read in markdown form. The Swedish word lagom comes to mind. It means, not too much and not too little. This goes for expressive syntaxes as well.

Code:

flowchart TB
    A --> C
    A --> D
    B --> C
    B --> D
New arrow types
There are new types of arrows supported as per below:

Code:

flowchart LR
    A --o B
    B --x C
Multi directional arrows
There is the possibility to use multidirectional arrows.

Code:

flowchart LR
    A o--o B
    B <--> C
    C x--x D
Minimum length of a link
Each node in the flowchart is ultimately assigned to a rank in the rendered graph, i.e. to a vertical or horizontal level (depending on the flowchart orientation), based on the nodes to which it is linked. By default, links can span any number of ranks, but you can ask for any link to be longer than the others by adding extra dashes in the link definition.

In the following example, two extra dashes are added in the link from node B to node E, so that it spans two more ranks than regular links:

Code:

flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
Note Links may still be made longer than the requested number of ranks by the rendering engine to accommodate other requests.

When the link label is written in the middle of the link, the extra dashes must be added on the right side of the link. The following example is equivalent to the previous one:

Code:

flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]
For dotted or thick links, the characters to add are equals signs or dots, as summed up in the following table:

Length\t1\t2\t3
Normal\t---\t----\t-----
Normal with arrow\t-->\t--->\t---->
Thick\t===\t====\t=====
Thick with arrow\t==>\t===>\t====>
Dotted\t-.-\t-..-\t-...-
Dotted with arrow\t-.->\t-..->\t-...->
Special characters that break syntax
It is possible to put text within quotes in order to render more troublesome characters. As in the example below:

Code:

flowchart LR
    id1["This is the (text) in the box"]
Entity codes to escape characters
It is possible to escape characters using the syntax exemplified here.

Code:

flowchart LR
        A["A double quote:#quot;"] -->B["A dec char:#9829;"]
Numbers given are base 10, so # can be encoded as #35;. It is also supported to use HTML character names.

Subgraphs
subgraph title
    graph definition
end
An example below:

Code:

flowchart TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
You can also set an explicit id for the subgraph.

Code:

flowchart TB
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end
flowcharts
With the graphtype flowchart it is also possible to set edges to and from subgraphs as in the flowchart below.

Code:

flowchart TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
    one --> two
    three --> two
    two --> c2
Direction in subgraphs
With the graphtype flowcharts you can use the direction statement to set the direction which the subgraph will render like in this example.

Code:

flowchart LR
  subgraph TOP
    direction TB
    subgraph B1
        direction RL
        i1 -->f1
    end
    subgraph B2
        direction BT
        i2 -->f2
    end
  end
  A --> TOP --> B
  B1 --> B2
Markdown Strings
The "Markdown Strings" feature enhances flowcharts and mind maps by offering a more versatile string type, which supports text formatting options such as bold and italics, and automatically wraps text within labels.

Code:

%%{init: {"flowchart": {"htmlLabels": false}} }%%
flowchart LR
subgraph "One"
  a("\`The **cat**
  in the hat\`") -- "edge label" --> b{{"\`The **dog** in the hog\`"}}
end
subgraph "\`**Two**\`"
  c("\`The **cat**
  in the hat\`") -- "\`Bold **edge label**\`" --> d("The dog in the hog")
end
Formatting:

For bold text, use double asterisks (**) before and after the text.
For italics, use single asterisks (*) before and after the text.
With traditional strings, you needed to add <br> tags for text to wrap in nodes. However, markdown strings automatically wrap text when it becomes too long and allows you to start a new line by simply using a newline character instead of a <br> tag.
This feature is applicable to node labels, edge labels, and subgraph labels.

Interaction
It is possible to bind a click event to a node, the click can lead to either a javascript callback or to a link which will be opened in a new browser tab.

INFO

This functionality is disabled when using securityLevel='strict' and enabled when using securityLevel='loose'.

click nodeId callback
click nodeId call callback()
nodeId is the id of the node
callback is the name of a javascript function defined on the page displaying the graph, the function will be called with the nodeId as parameter.
Examples of tooltip usage below:


<script>
  const callback = function () {
    alert('A callback was triggered');
  };
</script>
The tooltip text is surrounded in double quotes. The styles of the tooltip are set by the class .mermaidTooltip.

Code:

flowchart LR
    A-->B
    B-->C
    C-->D
    click A callback "Tooltip for a callback"
    click B "https://www.github.com" "This is a tooltip for a link"
    click A call callback() "Tooltip for a callback"
    click B href "https://www.github.com" "This is a tooltip for a link"
Success The tooltip functionality and the ability to link to urls are available from version 0.5.2.

?> Due to limitations with how Docsify handles JavaScript callback functions, an alternate working demo for the above code can be viewed at this jsfiddle.

Links are opened in the same browser tab/window by default. It is possible to change this by adding a link target to the click definition (_self, _blank, _parent and _top are supported):

Code:

flowchart LR
    A-->B
    B-->C
    C-->D
    D-->E
    click A "https://www.github.com" _blank
    click B "https://www.github.com" "Open this in a new tab" _blank
    click C href "https://www.github.com" _blank
    click D href "https://www.github.com" "Open this in a new tab" _blank
Beginner's tip—a full example using interactive links in a html context:


<body>
  <pre class="mermaid">
    flowchart LR
        A-->B
        B-->C
        C-->D
        click A callback "Tooltip"
        click B "https://www.github.com" "This is a link"
        click C call callback() "Tooltip"
        click D href "https://www.github.com" "This is a link"
  </pre>

  <script>
    const callback = function () {
      alert('A callback was triggered');
    };
    const config = {
      startOnLoad: true,
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'cardinal' },
      securityLevel: 'loose',
    };
    mermaid.initialize(config);
  </script>
</body>
Comments
Comments can be entered within a flow diagram, which will be ignored by the parser. Comments need to be on their own line, and must be prefaced with %% (double percent signs). Any text after the start of the comment to the next newline will be treated as a comment, including any flow syntax

Code:

flowchart LR
%% this is a comment A -- text --> B{node}
   A -- text --> B -- text2 --> C
Styling and classes
Styling links
It is possible to style links. For instance, you might want to style a link that is going backwards in the flow. As links have no ids in the same way as nodes, some other way of deciding what style the links should be attached to is required. Instead of ids, the order number of when the link was defined in the graph is used, or use default to apply to all links. In the example below the style defined in the linkStyle statement will belong to the fourth link in the graph:

linkStyle 3 stroke:#ff3,stroke-width:4px,color:red;
Styling line curves
It is possible to style the type of curve used for lines between items, if the default method does not meet your needs. Available curve styles include basis, bumpX, bumpY, cardinal, catmullRom, linear, monotoneX, monotoneY, natural, step, stepAfter, and stepBefore.

In this example, a left-to-right graph uses the stepBefore curve style:

%%{ init: { 'flowchart': { 'curve': 'stepBefore' } } }%%
graph LR
For a full list of available curves, including an explanation of custom curves, refer to the Shapes documentation in the d3-shape project.

Styling a node
It is possible to apply specific styles such as a thicker border or a different background color to a node.

Code:

flowchart LR
    id1(Start)-->id2(Stop)
    style id1 fill:#f9f,stroke:#333,stroke-width:4px
    style id2 fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
Classes
More convenient than defining the style every time is to define a class of styles and attach this class to the nodes that should have a different look.

a class definition looks like the example below:

    classDef className fill:#f9f,stroke:#333,stroke-width:4px;
Attachment of a class to a node is done as per below:

    class nodeId1 className;
It is also possible to attach a class to a list of nodes in one statement:

    class nodeId1,nodeId2 className;
A shorter form of adding a class is to attach the classname to the node using the :::operator as per below:

Code:

flowchart LR
    A:::someclass --> B
    classDef someclass fill:#f96
Css classes
It is also possible to predefine classes in css styles that can be applied from the graph definition as in the example below:

Example style


<style>
  .cssClass > rect {
    fill: #ff0000;
    stroke: #ffff00;
    stroke-width: 4px;
  }
</style>
Example definition

Code:

flowchart LR
    A-->B[AAA<span>BBB</span>]
    B-->D
    class A cssClass
Default class
If a class is named default it will be assigned to all classes without specific class definitions.

    classDef default fill:#f9f,stroke:#333,stroke-width:4px;
Basic support for fontawesome
It is possible to add icons from fontawesome.

The icons are accessed via the syntax fa:#icon class name#.

Code:

flowchart TD
    B["fab:fa-twitter for peace"]
    B-->C[fa:fa-ban forbidden]
    B-->D(fa:fa-spinner)
    B-->E(A fa:fa-camera-retro perhaps?)
Mermaid is compatible with Font Awesome up to verion 5, Free icons only. Check that the icons you use are from the supported set of icons.

Graph declarations with spaces between vertices and link and without semicolon
In graph declarations, the statements also can now end without a semicolon. After release 0.2.16, ending a graph statement with semicolon is just optional. So the below graph declaration is also valid along with the old declarations of the graph.

A single space is allowed between vertices and the link. However there should not be any space between a vertex and its text and a link and its text. The old syntax of graph declaration will also work and hence this new feature is optional and is introduced to improve readability.

Below is the new declaration of the graph edges which is also valid along with the old declaration of the graph edges.

Code:

flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]


`

export const mindmapDocument = `
Mermaid Js Mindmap Document

"A mind map is a diagram used to visually organize information into a hierarchy, showing relationships among pieces of the whole. It is often created around a single concept, drawn as an image in the center of a blank page, to which associated representations of ideas such as images, words and parts of words are added. Major ideas are connected directly to the central concept, and other ideas branch out from those major ideas." Wikipedia

An example of a mindmap.
Code:

mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
Syntax
The syntax for creating Mindmaps is simple and relies on indentation for setting the levels in the hierarchy.

In the following example you can see how there are 3 different levels. One with starting at the left of the text and another level with two rows starting at the same column, defining the node A. At the end there is one more level where the text is indented further then the previous lines defining the nodes B and C.

mindmap
    Root
        A
            B
            C
In summary is a simple text outline where there are one node at the root level called Root which has one child A. A in turn has two children Band C. In the diagram below we can see this rendered as a mindmap.

Code:

mindmap
Root
    A
      B
      C
In this way we can use a text outline to generate a hierarchical mindmap.

Different shapes
Mermaid mindmaps can show nodes using different shapes. When specifying a shape for a node the syntax is similar to flowchart nodes, with an id followed by the shape definition and with the text within the shape delimiters. Where possible we try/will try to keep the same shapes as for flowcharts, even though they are not all supported from the start.

Mindmap can show the following shapes:

Square
Code:

mindmap
    id[I am a square]
Rounded square
Code:

mindmap
    id(I am a rounded square)
Circle
Code:

mindmap
    id((I am a circle))
Bang
Code:

mindmap
    id))I am a bang((
Cloud
Code:

mindmap
    id)I am a cloud(
Hexagon
Code:

mindmap
    id{{I am a hexagon}}
Default
Code:

mindmap
    I am the default shape
More shapes will be added, beginning with the shapes available in flowcharts.

Icons and classes
Icons
As with flowcharts you can add icons to your nodes but with an updated syntax. The styling for the font based icons are added during the integration so that they are available for the web page. This is not something a diagram author can do but has to be done with the site administrator or the integrator. Once the icon fonts are in place you add them to the mind map nodes using the ::icon() syntax. You place the classes for the icon within the parenthesis like in the following example where icons for material design and Font Awesome 5 are displayed. The intention is that this approach should be used for all diagrams supporting icons. Experimental feature: This wider scope is also the reason Mindmaps are experimental as this syntax and approach could change.

Code:

mindmap
    Root
        A
        ::icon(fa fa-book)
        B(B)
        ::icon(mdi mdi-skull-outline)
Classes
Again the syntax for adding classes is similar to flowcharts. You can add classes using a triple colon following a number of css classes separated by space. In the following example one of the nodes has two custom classes attached urgent turning the background red and the text white and large increasing the font size:

Code:

mindmap
    Root
        A[A]
        :::urgent large
        B(B)
        C
These classes need to be supplied by the site administrator.

Unclear indentation
The actual indentation does not really matter only compared with the previous rows. If we take the previous example and disrupt it a little we can se how the calculations are performed. Let us start with placing C with a smaller indentation than Bbut larger then A.

mindmap
    Root
        A
            B
          C
This outline is unclear as B clearly is a child of A but when we move on to C the clarity is lost. C is not a child of B with a higher indentation nor does it have the same indentation as B. The only thing that is clear is that the first node with smaller indentation, indicating a parent, is A. Then Mermaid relies on this known truth and compensates for the unclear indentation and selects A as a parent of C leading till the same diagram with B and C as siblings.

Code:

mindmap
Root
    A
        B
      C
Markdown Strings
The "Markdown Strings" feature enhances mind maps by offering a more versatile string type, which supports text formatting options such as bold and italics, and automatically wraps text within labels.

Code:

mindmap
    id1["\`**Root** with
a second line
Unicode works too: 🤓\`"]
      id2["\`The dog in **the** hog... a *very long text* that wraps to a new line\`"]
      id3[Regular labels still works]
Formatting:

For bold text, use double asterisks ** before and after the text.
For italics, use single asterisks * before and after the text.
With traditional strings, you needed to add
tags for text to wrap in nodes. However, markdown strings automatically wrap text when it becomes too long and allows you to start a new line by simply using a newline character instead of a
tag.
`
export default {
	sequenceDiagramDocument,
	flowchartDocument,
	mindmapDocument
}
