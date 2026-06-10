标签: [[数学]] [[概率]] [[公式]] [[概念]]

类似于[[卡方分布]], t分布也可以从一个实际问题中来. 

在实际工业生产（如抽样检测麦量）中, 由于抽样次数有限, 故**我们几乎永远无法知道总体真实的标​​准差$\sigma$。**

在之前的推导中，标准[[正态分布]] $Z$ 的构造依赖于已知的 $\sigma$：
$$Z = \frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \sim N(0,1)$$
当 $\sigma$ 未知时，数学家只能使用样本计算出的标准差 $S$ 来代替 $\sigma$。由此构造出了一个新的统计量 $T$：
$$T = \frac{\bar{X} - \mu}{S/\sqrt{n}}$$
注意到, $S$本身也是一个基于样本计算出来的随机变量。用一个随机变量去标准化另一个随机变量，结果不会是完美的标准正态分布。

首先，我们构造出真正的随机变量$Z$: 
$$
T = \frac{\frac{\bar{X} - \mu}{\sigma/\sqrt{n}}}{\frac{S}{\sigma}} = \frac{Z}{S/\sigma}
$$
根据数理统计中的费雪定理，对于正态总体，样本均值 $\bar{X}$ 和样本方差 $S^2$ 是**严格相互独立**的。并且，样本方差经过缩放后服从[[卡方分布#^aa76a6]]： ^34fe79
$$
\frac{(n-1)S^2}{\sigma^2} \sim \chi^2(n-1)
$$
我们将[[自由度]]记为 $v = n-1$，并令 $V = \frac{v S^2}{\sigma^2}$，则 $V \sim \chi^2(v)$. 反解出 $\frac{S}{\sigma}$：
$$\frac{S}{\sigma} = \sqrt{\frac{V}{v}}$$
将其代回 $T$ 的表达式，我们得到了 t 统计量的纯代数定义：
$$T = \frac{Z}{\sqrt{V/v}}$$
其中，$Z \sim N(0,1)$，$V \sim \chi^2(v)$，且 $Z$ 与 $V$ 相互独立. 

---
因为 $Z$ 和 $V$ 是独立的，它们的联合概率密度函数 $f(z, v)$ 等于各自密度函数的乘积：
$$f_Z(z) = \frac{1}{\sqrt{2\pi}} e^{-\frac{1}{2}z^2}$$
$$f_V(v) = \frac{1}{2^{v/2}\Gamma(v/2)} v^{\frac{v}{2}-1} e^{-\frac{1}{2}v} \quad (v > 0)$$
相乘得到联合密度：
$$f(z, v) = \frac{1}{\sqrt{2\pi} 2^{v/2} \Gamma(v/2)} v^{\frac{v}{2}-1} e^{-\frac{1}{2}(z^2 + v)}$$
我们的目标是求 $T$ 的分布，因此需要将变量 $(Z, V)$ 替换为包含 $T$ 的新变量。

令目标变量 $T = \frac{Z}{\sqrt{V/v}}$，引入辅助变量 $W = V$。反解出原变量 $Z$ 和 $V$：
$$z = t \sqrt{\frac{w}{v}}$$
$$v = w$$
计算[[Jacobi行列式]] $J$：

$$J = \begin{vmatrix} \frac{\partial z}{\partial t} & \frac{\partial z}{\partial w} \\ \frac{\partial v}{\partial t} & \frac{\partial v}{\partial w} \end{vmatrix} = \begin{vmatrix} \sqrt{\frac{w}{v}} & t \frac{1}{2\sqrt{wv}} \\ 0 & 1 \end{vmatrix} = \sqrt{\frac{w}{v}}$$
将新变量和雅可比行列式的绝对值代入联合密度函数，得到 $T$ 和 $W$ 的联合密度 $f_{T,W}(t, w)$：
$$f_{T,W}(t, w) = f_Z\left(t\sqrt{\frac{w}{v}}\right) f_V(w) |J|$$
$$f_{T,W}(t, w) = \frac{1}{\sqrt{2\pi} 2^{v/2} \Gamma(v/2)} w^{\frac{v}{2}-1} e^{-\frac{1}{2}\left(t^2\frac{w}{v} + w\right)} \sqrt{\frac{w}{v}}$$
整理:  
$$
f_{T,W}(t, w) = \frac{1}{\sqrt{2\pi v} 2^{v/2} \Gamma(v/2)} w^{\frac{v+1}{2}-1} e^{-\frac{w}{2}\left(1 + \frac{t^2}{v}\right)}$$

为了求出单独的$T$的边缘概率密度$f_T(t)$，我们需要对辅助变量$w$在其定义域 $(0, +\infty)$ 上进行积分：
$$f_T(t) = \int_{0}^{\infty} f_{T,W}(t, w) \, \mathrm{d}w$$
$$f_T(t) = \frac{1}{\sqrt{2\pi v} 2^{v/2} \Gamma(v/2)} \int_{0}^{\infty} w^{\frac{v+1}{2}-1} e^{-w \frac{1 + t^2/v}{2}} \, \mathrm{d}w$$
观察积分号内部的形式为Gamma积分

根据
$$
\int_{0}^{\infty} x^{\alpha-1} e^{-\beta x} \mathrm{d}x = \frac{\Gamma(\alpha)}{\beta^\alpha}
$$
得到$\alpha = \frac{v+1}{2}$, $\beta = \frac{1}{2}\left(1 + \frac{t^2}{v}\right)$    
代入
$$
f_T(t) = \frac{1}{\sqrt{2\pi v} 2^{v/2} \Gamma(v/2)} \cdot \frac{\Gamma\left(\frac{v+1}{2}\right)}{\left[ \frac{1}{2}\left(1 + \frac{t^2}{v}\right) \right]^{\frac{v+1}{2}}}$$
化简后得到: 
$$f_T(t) = \frac{\Gamma\left(\frac{v+1}{2}\right)}{\sqrt{v\pi} \Gamma\left(\frac{v}{2}\right)} \left(1 + \frac{t^2}{v}\right)^{-\frac{v+1}{2}}$$

可以看出，当样本量较小（自由度 $v$ 较小）时，分母中增加的方差不确定性导致$T$的分布比标准正态分布尾部更厚. 

---
假设$\sigma_{1} = \sigma_{2}$, 则
$$
\sqrt{ \frac{nm(n + m - 2)}{n+m} } ((\overline{X} - \overline{Y}) - (\mu_{1} - \mu_{2})) / \left( \sum_{i=1}^{n} (X_{i} - \overline{X})^{2} + \sum_{j=1}^{m} (Y_{j} - \overline{Y})^{2} \right) \sim t_{n+m-2}
$$
这个实际上是上面的拓展, 只要上面都是独立的, 这个式子就会相对显然