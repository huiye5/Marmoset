## Marmoset 库说明
Marmoset 为世界上最小的一种猴类，称绒猴，又称指猴。很小，但也是个猴啊~... 
本框架所做的事情，希望在Essa业务基础上逐步扩展，不做大而全，提供基础业务抽象与常用功能抽离。

## 设计
尽可能抽离出小模块，各个模块间将耦合降到最低，可以按需加载，同时配合服务器可提供按需打包功能。

## 模块划分

### Loader
提供各个模块加载功能
  
### Lang
提供 JavaScript (es3) 语言本身缺失的一些常用功能，比如 `trim`, `each`, `map` 等。现阶段可用 `underscore` 或 `lodash` 代替。
待业务不忙时，可以自己实现，因为其实不需要用到这么多方法的。

###Core
 * dom
  + dom 操作 query, remove, append, addClass, removeClass, attr 等
    
 * io
   + ajax, JSONP, CORS 等
    
 * event
   + on, off, delegate, unDelegate, trigger
    
 * json
   + parse
   + stringify
    
 * promise
   + Promise
   + Deffer

### components
组件库是一个比较庞大的东西，在此提供一个组件的基础接口，可以将其想象成一个 `Interface`，
其他组件都需要继承
（可以通过 `Lang` 模块中的 `inherit` 方法、 `Components.extend` 或者 `CoffeeScript` 和 `TypeScript` 之类的语法糖来继承。 
es6还不成熟，不能用于生产环境 ）该组件。
所有的组件都需要包含以下的公有属性(不带()的)和方法：

* content
* node
* parent
* render()
* beforeRender()
* afterRender()
* width
* height
* x
* y

