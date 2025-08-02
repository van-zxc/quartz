标签：[[物理]] [[分析]] [[电磁感应]] [[电阻]] [[电磁学]] 

# 统一微分方程解

根据[[基尔霍夫方程组]], 假设一开始某处存有能量，没有外界电源存在：
$$
iR + L\frac{\mathrm{d}i}{\mathrm{d}t} + \frac{q}{C} = 0
$$
统一为关于$q$的二阶齐次线性微分方程：
$$
\frac{1}{C} q + R\frac{\mathrm{d}q}{\mathrm{d}t} + L\frac{\mathrm{d}^2 q}{\mathrm{d}t^2} = 0
$$
该方程简直与[[阻尼振动]]里的方程如出一辙。在这里我们就直接开始引用结论了。

应该是有三种情况的。令$2\beta = \frac{R}{L}$, $\omega^2 = \frac{1}{LC}$. 则问题转化为了比较$\beta$和$\omega$的关系。

1. $\beta>\omega$, 则该方程具有实数解，变成了过阻尼的状态。定义$\beta_0 = \sqrt{ \beta^2 - \omega^2 }$. 解的形式应该是
$$
e^{-\beta t}(A e^{\beta_0 t} + B e^{-\beta_0 t})
$$
2. $\beta = \omega$，即该方程两个解恰好相同，此时恰好为临界状态，具有临界阻尼. 形式应该为
$$
e^{-\beta t}(A + Bt)
$$
3. $\beta<\omega$, 此时该方程只有虚数解。根据[[欧拉公式]]，转化为正余弦状态，上下来回抖动。因此为欠阻尼状态。表达式：
$$
q = Ae^{(-R/2L)t}\cos \left(\sqrt{ \frac{1}{LC}  - \frac{R^2}{4L^2}} t + \phi \right)
$$
	此时的$\omega = \sqrt{ \omega^2 - \frac{R^2}{4L^2} }$

# 品质系数

类似[[阻尼振动]], 我们也有衰减的系数$Q$, 称品质系数. 表达式为
$$
Q = \omega \frac{\text{存储总能量}}{\text{平均耗散功率}}
$$
在$R-L-C$震荡电路里, $Q = \frac{\omega L}{R}$

[[微分方程]]

# [[谐振]]