标签: [[数学]] [[级数]] [[分类]] [[公式]] 

众所周知, 三角函数和幂函数是最简单的两个函数之一. 那么既然[[Taylor级数]]已经做到将某些级数以幂级数展开了, 那么三角函数是否也可以呢? 答案是肯定的. 这就是我们将要研究的Fourier级数. 

# 周期函数展开

## 周期为$2\pi$

基础是三角函数的正交性, 也就是说满足
$$
\int_{-\pi}^{\pi} \cos mx \cos nx \, dx  = \int_{-\pi}^{\pi} \sin nx \sin mx \, dx  = 0(m\neq n)
$$
$$
\int_{-\pi}^{\pi} \sin nx \cos mx \, dx  = 0 \quad m, n任取
$$
$$
\int_{-\pi}^{\pi} \cos^{2}x \,\mathrm{d}x = \int_{-\pi}^{\pi}\sin^{2}x \mathrm{d}x = \frac{\pi}{2}
$$
性质太太太优良了呀! 

我们假设某个函数$f(x)$能够表示为以下形式
$$
f(x) = \frac{a_{0}}{2} + \sum_{n=1}^{\infty}(a_{n}\cos nx + b_{n}\sin nx) 
$$
(前面系数是为了方便统一形式)

在$(-\pi, \pi)$范围内, 两侧积分(不乘东西/乘$\sin mx$/乘$\cos mx$)
$$
\int_{-\pi}^{\pi} f(x) \,\mathrm{d}x = a_{0} \cdot \pi \implies a_{0} = \frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\, \mathrm{d}x
$$
$$
\int_{-\pi}^{\pi} f(x) \cos mx \,\mathrm{d}x = a_{m} \cdot \pi \implies a_{m} = \frac{1}{\pi}\int_{-\pi}^{\pi}f(x) \cos mx\, \mathrm{d}x
$$
$$
\int_{-\pi}^{\pi} f(x) \sin nx \,\mathrm{d}x = b_{n} \cdot \pi \implies b_{n} = \frac{1}{\pi}\int_{-\pi}^{\pi}f(x) \sin nx\, \mathrm{d}x
$$
这样子就可以统一了捏. 这个公式就称为Euler-Fourier公式. 

但是, 这个级数是否收敛还是有疑问的哈. 留待后面讨论

## 周期非$2\pi$

显然的, 我们只需要进行一次换元! 

假设原函数的周期为$2T$, 令$x = \frac{T}{\pi}t$, 那么换x为t之后的函数周期就变为了$2\pi$, 就可以采用之前那一套方法了! 

那么这里我们直接给出$Euler-Fourier$公式的拓展: ($x \in (-T, T)$)
$$
\begin{align}
 & a_{n} = \frac{1}{T} \int_{-T}^{T} f(x) \cos \frac{n\pi}{T}x \, \mathrm{d}x \quad n = 0,1,2,\dots\\
 & b_{n} = \frac{1}{T} \int_{-T}^{T} f(x) \sin \frac{n\pi}{T}x \, \mathrm{d}x \quad n = 1,2,3\dots\\
\end{align}
$$

# 非周期函数

对于并不具有周期的函数, 应该怎么办呢? 答: 我们可以对其进行周期延拓, 使之具有类似于周期函数的性质

## 正弦级数/余弦级数

假设一个函数在$(0,T)$内有定义, 那么我们就可以对它做一些不规矩的事情, 比如……想什么呢? 我们把它补全! 使之在$(-T, T)$内形成一个奇函数. 然后再拓展, 把整个实数轴都填满. 

此时, 由于该函数为奇函数, 因此所以原式具有的$\cos x$全部被消掉. 此时相应的$Fourier$级数为
$$
\frac{a_{0}}{2} + \frac{2}{\pi} \sum_{n=1}^{\infty} b_{n}\sin nx 
$$
该级数即称为正弦级数

类似的, 既然我们可以构造一个关于原点对称的奇函数, 自然也可以构造一个偶函数, 此时便称为余弦级数, 表达式为
$$
\frac{a_{0}}{2} + \frac{2}{\pi}\sum_{n=1}^{\infty} a_{n} \cos nx
$$
# 收敛性

$Fourier$级数对于函数本身的要求比较弱啊, 但是呢对于讨论收敛性来说, $Fourier$级数要比$Taylor$级数困难的多. 

我在此处的定义是不严格的, 但是定理应该是严格成立的. 

+ 分段连续: 即该函数只有有限个间断点, 在绝大部分区域上, 该函数是连续的. 
+ 分段可导: 同样的, 该函数的导数只有有限个不连续点. 

则有如下定理: 

$$
\begin{aligned}
& \text{若函数 } f(x) \text{ 的周期为 } 2T\text{，且满足以下任意条件：} \\[0.5em]
& \quad \begin{cases}
    \text{(Dirichlet 条件)} & 
    \text{在 } [-T, T] \text{ 上分段单调且只有有限个第一类间断点} \\[0.5ex]
    \text{(Lipschitz 条件)} & 
    \text{在 } [-T, T] \text{ 上分段可导}
\end{cases} \\[1em]
& \text{则其 Fourier 级数在每点 } x \text{ 处收敛，且收敛值为：} \\
& \quad \frac{1}{2}\Big[ f(x-) + f(x+) \Big]
\end{aligned}
$$