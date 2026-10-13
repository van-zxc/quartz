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
# 贝塞尔不等式

考虑跟[[泛函分析]]强相关，我们容易证明，$\sin x$和$\cos x$在 函数空间内是正交的，$\sin nx;\cos nx$这两组函数的组合就足以表示整个函数空间（除了一些病态的函数）。

我觉得可以考虑从[[内积与正交]]和内积空间的角度理解问题。

我们将三角函数的内积定义如下：
$$
\langle f, g \rangle = \int_{-\pi}^{\pi} f(x)g(x) \, dx
$$
对应地，函数的“长度平方”（即范数的平方）定义为：
$$
\Vert{}f\Vert{}^2 = \langle f, f \rangle = \int_{-\pi}^{\pi} \vert{}f(x)\vert{}^2 \, dx
$$
标准三角函数集可以认为是：
$$
\{1, \cos(x), \sin(x), \cos(2x), \sin(2x), \dots, \cos(nx), \sin(nx), \dots\}
$$
根据三角函数的积化和差积分公式，该函数集中任意两个不同函数的内积均为 $0$。这表明它们在函数空间中构成了互相垂直（正交）的坐标轴。

将其单位化（即调整每个基函数的模长为 $1$），可以得到标准正交基组：
$$
e_0(x) = \frac{1}{\sqrt{2\pi}}
$$

$$
e_{2n-1}(x) = \frac{\cos(nx)}{\sqrt{\pi}} \quad (n \ge 1)
$$

$$
e_{2n}(x) = \frac{\sin(nx)}{\sqrt{\pi}} \quad (n \ge 1)
$$
对于任意单位正交基 $e_k(x)$，满足 $\langle e_i, e_j \rangle = \delta_{ij}$（当 $i=j$ 时为 $1$，当 $i \neq j$ 时为 $0$）。

在空间中，向量 $f(x)$ 在正交基 $e_k(x)$ 上的坐标分量，为内积：
$$
c_k = \langle f, e_k \rangle
$$
若选取前 $N$ 项正交基，将 $f(x)$ 投影到由这 $N$ 个基函数张成的有限维子空间 $V_N$ 上，得到的投影向量 $f_N(x)$ 为：
$$
f_N(x) = \sum_{k=0}^N c_k e_k(x)
$$
根据正交基的性质，投影向量 $f_N(x)$ 的长度平方等于各个坐标分量平方相加：
$$
\Vert{}f_N\Vert{}^2 = \left\langle \sum_{k=0}^N c_k e_k, \sum_{j=0}^N c_j e_j \right\rangle = \sum_{k=0}^N c_k^2
$$

正交投影的代数特性在于：误差向量 $e_N(x) = f(x) - f_N(x)$ 必然垂直于投影子空间 $V_N$ 中的每一个基函数。

即对任意 $k \le N$，均有 $\langle f - f_N, e_k \rangle = 0$。因此，向量 $f(x)$ 被分解为两个互相垂直的直角边：
1. 位于子空间内的投影向量 $f_N(x)$
2. 垂直于子空间的残差向量 $f(x) - f_N(x)$

在内积空间中应用勾股定理：
$$
\Vert{}f\Vert{}^2 = \Vert{}f_N\Vert{}^2 + \Vert{}f - f_N\Vert{}^2 \geq ||f_{N}||^{2}
$$
即：
$$
\sum_{k=0}^N c_k^2 \le \Vert{}f\Vert{}^2 \implies \sum_{k=0}^\infty c_k^2 \le \Vert{}f\Vert{}^2
$$
将标准正交基的系数更正为常见的傅里叶展开系数：
$$
a_0 = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x) \, dx
$$

$$
a_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos(nx) \, dx
$$

$$
b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx) \, dx
$$

将坐标分量 $c_k$ 用 $a_0, a_n, b_n$ 替换后，贝塞尔不等式：
$$
\frac{a_0^2}{2} + \sum_{n=1}^\infty (a_n^2 + b_n^2) \le \frac{1}{\pi} \int_{-\pi}^{\pi} \vert{}f(x)\vert{}^2 \, dx
$$
当取等时我们得到Parseval定理，此时$n \to \infty$

直觉上就是，当$n \to \infty$时，在宏观的函数空间能够通过正交基完全拟合，不会有任何误差，因此当n趋于无穷时取到。

---
# 满足条件

### 1. Dirichlet条件

若周期为 $T = 2\pi$ 的函数 $f(x)$ 在一个周期区间 $[-\pi, \pi]$ 上满足以下三个条件，则其傅里叶级数在任意点均收敛：

1. . **绝对可积**：$f(x)$ 在 $[-\pi, \pi]$ 上绝对可积，即：
    $$
    \int_{-\pi}^{\pi} \vert{}f(x)\vert{} \, dx < \infty
    $$
2. **极值点有限**：$f(x)$ 在任意有限区间内只有**有限个**极值点（极小值和极大值）。
3. **间断点有限**：$f(x)$ 在任意有限区间内只有**有限个**间断点，且所有间断点均为**第一类间断点**（即左极限 $f(x^-)$ 与右极限 $f(x^+)$ 均存在且有限）。

满足狄利克雷条件时，傅里叶级数在各点的收敛情况如下：
- **连续点**：级数完全收敛于原函数值 $f(x)$
- **间断点**：级数收敛于该点左右极限的算术平均值：
    $$
    \frac{f(x^+) + f(x^-)}{2}
    $$
### 2. 连续性条件

如果希望傅里叶级数不仅逐点收敛，而且**一致收敛**（近似精度在整个区间上均匀一致，界限跃变），当$f(x)$ 在整条实轴上连续、以 $2\pi$ 为周期，且其导数 $f'(x)$ 在周期区间内分段连续（即 $f(x)$ 是连续且分段光滑的）。此时，傅里叶级数一致收敛于 $f(x)$。

