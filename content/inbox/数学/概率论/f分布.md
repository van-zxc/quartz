标签: [[数学]] [[公式]] [[概率]]

F 分布的出现是为了解决数理统计中的核心诉求：**比较两个独立样本的方差。**

当我们想验证两组独立数据（比如两台不同机器生产的零件）的波动程度是否一致时，排除本身大小的合理比较方式就是求两者之比. 在[[卡方分布#^aa76a6]]中, 已经知晓样本方差服从卡方分布，那么两个独立样本方差的比例，本质上就是**两个独立的卡方变量之比**。

因此F分布定义为**两个相互独立的卡方分布随机变量，分别除以它们各自的自由度之后的商。**

设 $U \sim \chi^2(d_1)$ 和 $V \sim \chi^2(d_2)$，且 $U$ 与 $V$ 相互独立。F 统计量定义为：
$$
F = \frac{U/d_1}{V/d_2} = \frac{S_{1}^{2}}{S_{2}^{2}} \cdot \frac{\sigma_{2}^{2}}{\sigma_{1}^{2}}
$$
由于 $U$ 和 $V$ 是相互独立的，它们的联合概率密度函数 $f_{U,V}(u, v)$ 严格等于两个独立[[卡方分布]]密度函数的乘积：
$$f_{U,V}(u, v) = \left( \frac{1}{2^{d_1/2}\Gamma(d_1/2)} u^{\frac{d_1}{2}-1} e^{-u/2} \right) \cdot \left( \frac{1}{2^{d_2/2}\Gamma(d_2/2)} v^{\frac{d_2}{2}-1} e^{-v/2} \right)$$
将常数项、指数项合并：
$$
f_{U,V}(u, v) = \frac{1}{2^{(d_1+d_2)/2}\Gamma(d_1/2)\Gamma(d_2/2)} u^{\frac{d_1}{2}-1} v^{\frac{d_2}{2}-1} e^{-\frac{u+v}{2}}
$$
为了求出 $F$ 的分布，我们引入目标变量 $F = \frac{u/d_1}{v/d_2}$，并保留分母部分的卡方变量作为辅助变量 $W = v$. (套路都是一样的)

反解出原变量 $u$ 和 $v$：
$$u = \frac{d_1}{d_2} f w$$
$$v = w$$
计算这个坐标变换的[[Jacobi行列式]]$J$：
$$
J = \begin{vmatrix} \frac{\partial u}{\partial f} & \frac{\partial u}{\partial w} \\ \frac{\partial v}{\partial f} & \frac{\partial v}{\partial w} \end{vmatrix} = \begin{vmatrix} \frac{d_1}{d_2}w & \frac{d_1}{d_2}f \\ 0 & 1 \end{vmatrix} = \frac{d_1}{d_2}w
$$
将 $u$、$v$ 表达式以及$|J|$ 代入联合密度函数中，得到 $(F, W)$ 的联合密度 $f_{F,W}(f, w)$：
$$
f_{F,W}(f, w) = f_{U,V}\left(\frac{d_1}{d_2}fw, w\right) \cdot \frac{d_1}{d_2}w
$$
展开：
$$
f_{F,W}(f, w) = \frac{1}{2^{(d_1+d_2)/2}\Gamma(d_1/2)\Gamma(d_2/2)} \left(\frac{d_1}{d_2}fw\right)^{\frac{d_1}{2}-1} w^{\frac{d_2}{2}-1} e^{-\frac{\frac{d_1}{d_2}fw + w}{2}} \cdot \frac{d_1}{d_2}w
$$
整理：
$$
f_{F,W}(f, w) = \frac{\left(\frac{d_1}{d_2}\right)^{\frac{d_1}{2}} f^{\frac{d_1}{2}-1}}{2^{(d_1+d_2)/2}\Gamma(d_1/2)\Gamma(d_2/2)} w^{\frac{d_1+d_2}{2}-1} e^{-\frac{w}{2}\left(\frac{d_1}{d_2}f + 1\right)}
$$
将辅助变量 $w$ 在正半轴 $(0, +\infty)$ 上积分：
$$f_F(f) = \int_{0}^{\infty} f_{F,W}(f, w) \, \mathrm{d}w$$
观察积分号内部，这又是一个标准的 Gamma 积分形式 $\int_0^\infty x^{\alpha-1} e^{-\beta x} dx = \frac{\Gamma(\alpha)}{\beta^\alpha}$，其中：
- $\alpha = \frac{d_1+d_2}{2}$
- $\beta = \frac{1}{2}\left(\frac{d_1}{d_2}f + 1\right)$
变换：
$$
f_F(f) = \frac{\left(\frac{d_1}{d_2}\right)^{\frac{d_1}{2}} f^{\frac{d_1}{2}-1}}{2^{(d_1+d_2)/2}\Gamma(d_1/2)\Gamma(d_2/2)} \cdot \frac{\Gamma\left(\frac{d_1+d_2}{2}\right)}{\left[ \frac{1}{2}\left(\frac{d_1}{d_2}f + 1\right) \right]^{\frac{d_1+d_2}{2}}}
$$
最终，我们得到了表达式：
$$f_F(f) = \frac{\Gamma\left(\frac{d_1+d_2}{2}\right)}{\Gamma(d_1/2)\Gamma(d_2/2)} \left(\frac{d_1}{d_2}\right)^{\frac{d_1}{2}} f^{\frac{d_1}{2}-1} \left(1 + \frac{d_1}{d_2}f\right)^{-\frac{d_1+d_2}{2}} \quad (f > 0)$$

可以观察到, 实际上就是$B$函数的倒数, 因此也被称为第二类$B$函数

在零假设中, 我们通常假设两者方差没有差别, 即$\sigma_{1} = \sigma_{2}$. 因此我们需要研究的$F$分布即为$\frac{S_{1}^{2}}{S_{2}^{2}}$. 这就让我们可以进行具体计算. 

---
